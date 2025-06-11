"use client";
import { useState, useCallback, useRef, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress, Alert, Paper, Fade, Zoom } from '@mui/material';
import { Upload as UploadIcon, OpenInNew as OpenInNewIcon, Share as ShareIcon, Refresh as RefreshIcon, ContentCopy as ContentCopyIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useDropzone } from 'react-dropzone';
import type { DropzoneOptions } from 'react-dropzone';

interface ProcessingResult {
  success: boolean;
  content?: string;
  error?: string;
}

const QRCodeProcessor: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ProcessingResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Enhanced clipboard function with better error handling
  const copyToClipboard = async (text: string): Promise<void> => {
    try {
      // Check if we're in a browser environment
      if (typeof window === 'undefined') {
        console.warn('Clipboard not available: Not in browser environment');
        toast.error('Clipboard not available. Please copy manually.');
        return;
      }

      // Modern clipboard API (preferred) - check for both clipboard API and secure context
      if (navigator.clipboard && navigator.clipboard.writeText && window.isSecureContext) {
        try {
          await navigator.clipboard.writeText(text);
          toast.success('Copied to clipboard!');
          return;
        } catch (clipboardError) {
          console.warn('Modern clipboard API failed, trying fallback:', clipboardError);
          // Fall through to legacy method
        }
      }

      // Fallback for older browsers or non-secure contexts
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (successful) {
          toast.success('Copied to clipboard!');
          return;
        } else {
          throw new Error('Legacy copy command failed');
        }
      } catch (legacyError) {
        console.warn('Legacy clipboard method failed:', legacyError);
        throw new Error('All clipboard methods failed');
      }
    } catch (error) {
      console.warn('Copy to clipboard not supported or failed:', error);
      toast.error('Copy to clipboard not supported. Please copy the text manually.');
    }
  };

  const processImage = async (file: File): Promise<ProcessingResult> => {
    const startTime = performance.now();
    let processingResult: ProcessingResult = {
      success: false,
      error: 'Processing failed'
    };

    try {
      const jsQR = (await import('jsqr')).default;
      const image = new Image();
      const imageUrl = URL.createObjectURL(file);
      
      // Add timeout protection
      const timeoutId = setTimeout(() => {
        URL.revokeObjectURL(imageUrl);
        if (processingResult.success === false && processingResult.error === 'Processing failed') {
          processingResult = {
            success: false,
            error: 'Processing timed out. Please try a smaller image or different format.'
          };
          toast.error('Processing timed out. Please try a smaller image or different format.');
        }
      }, 10000);

      await new Promise<void>((resolve, reject) => {
        image.onload = () => {
          clearTimeout(timeoutId);
          resolve();
        };
        image.onerror = () => {
          clearTimeout(timeoutId);
          reject(new Error('Failed to load image'));
        };
        image.src = imageUrl;
      });

      const canvas = document.createElement('canvas');
      // Use optimized context for frequent reads
      const context = canvas.getContext('2d', { willReadFrequently: true });
      if (!context) {
        throw new Error('Could not get canvas context');
      }

      // Calculate optimal size for QR code detection
      // QR codes work best when the finder patterns are about 10-15 pixels wide
      const MIN_FINDER_PATTERN_SIZE = 10;
      const MAX_FINDER_PATTERN_SIZE = 15;
      
      // Estimate QR code size (assuming it takes up about 1/3 of the image)
      const estimatedQRSize = Math.min(image.width, image.height) / 3;
      const scale = Math.min(
        MAX_FINDER_PATTERN_SIZE / (estimatedQRSize / 7), // 7 is the number of modules in a finder pattern
        Math.max(1, MIN_FINDER_PATTERN_SIZE / (estimatedQRSize / 7))
      );

      const width = Math.floor(image.width * scale);
      const height = Math.floor(image.height * scale);

      canvas.width = width;
      canvas.height = height;

      // Preprocessing: Draw image with white background for better contrast
      context.fillStyle = 'white';
      context.fillRect(0, 0, width, height);
      
      // Use high-quality image scaling for better QR detection
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = 'high';
      context.drawImage(image, 0, 0, width, height);
      
      const imageData = context.getImageData(0, 0, width, height);
      
      // Enhanced jsQR options for better detection
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert"
      });

      URL.revokeObjectURL(imageUrl);

      if (code) {
        processingResult = {
          success: true,
          content: code.data
        };
        toast.success('QR code processed successfully!');
      } else {
        processingResult = {
          success: false,
          error: 'No QR code found in the image'
        };
        toast.error('No QR code found in the image');
      }
    } catch (err) {
      processingResult = {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to process image'
      };
      toast.error(processingResult.error);
    } finally {
      const processingTime = performance.now() - startTime;
      
      // Attempt to log the processing attempt, but don't let it affect the user experience
      try {
        const response = await fetch('/api/log', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            processingTime,
            success: processingResult.success,
            errorMessage: processingResult.error,
            qrCodeContent: processingResult.content
          }),
        });

        if (!response.ok) {
          console.warn('Failed to log processing attempt:', await response.text());
        }
      } catch (err) {
        // Silently handle logging errors - they shouldn't affect the user experience
        console.warn('Failed to log processing attempt:', err);
      }
    }

    return processingResult;
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    setIsProcessing(true);
    setError(null);
    setResult(null);

    try {
      const file = acceptedFiles[0];
      const result = await processImage(file);
      setResult(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while processing the image';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const dropzoneOptions: DropzoneOptions = {
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/gif': ['.gif'],
      'image/webp': ['.webp']
    },
    maxFiles: 1,
    multiple: false,
    maxSize: 10 * 1024 * 1024, // 10MB limit
    onDropRejected: (rejectedFiles) => {
      const rejection = rejectedFiles[0]?.errors[0];
      if (rejection?.code === 'file-too-large') {
        toast.error('File is too large. Please select a file smaller than 10MB.');
      } else if (rejection?.code === 'file-invalid-type') {
        toast.error('Invalid file type. Please select an image file.');
      } else {
        toast.error('File rejected. Please try another image.');
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone(dropzoneOptions);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }
      
      setIsProcessing(true);
      setError(null);
      setResult(null);
      
      try {
        const result = await processImage(file);
        setResult(result);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred while processing the image';
        setError(errorMessage);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleOpenUrl = () => {
    if (result?.success && result.content && isValidUrl(result.content)) {
      window.open(result.content, '_blank', 'noopener,noreferrer');
    }
  };

  const handleShare = async () => {
    if (result?.success && result.content) {
      try {
        // Check if Web Share API is supported
        if (navigator.share && typeof navigator.share === 'function') {
          await navigator.share({
            title: 'QR Code Content',
            text: result.content,
          });
        } else {
          // Fallback to clipboard
          await copyToClipboard(result.content);
        }
      } catch (err) {
        console.error('Error sharing:', err);
        // Fallback to clipboard if sharing fails
        await copyToClipboard(result.content);
      }
    }
  };

  const handleCopy = () => {
    if (result?.success && result.content) {
      copyToClipboard(result.content);
    }
  };

  const resetProcessor = () => {
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Prevent hydration mismatch by not rendering on server
  if (!isClient) {
    return (
      <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto', p: 3 }}>
        <Box
          sx={{
            border: '2px dashed',
            borderColor: 'grey.300',
            borderRadius: 2,
            p: 4,
            textAlign: 'center',
            bgcolor: 'background.paper',
          }}
        >
          <Typography variant="h6" gutterBottom>
            Loading QR Code Processor...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto', p: 3 }}>
      <Box
        {...getRootProps()}
        sx={{
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'grey.300',
          borderRadius: 2,
          p: 4,
          textAlign: 'center',
          cursor: 'pointer',
          bgcolor: isDragActive ? 'action.hover' : 'background.paper',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            borderColor: 'primary.main',
            bgcolor: 'action.hover'
          }
        }}
      >
        <input {...getInputProps()} />
        {isProcessing ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <CircularProgress />
            <Typography>Processing image...</Typography>
          </Box>
        ) : (
          <Box>
            <UploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              {isDragActive ? 'Drop the image here' : 'Drag & drop an image here, or click to select'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Supports PNG, JPG, JPEG, GIF, and WebP (max 10MB)
            </Typography>
          </Box>
        )}
      </Box>

      {error && (
        <Fade in={true}>
          <Box sx={{ mt: 2 }}>
            <Alert severity="error" sx={{ width: '100%' }} variant="filled">
              {error}
            </Alert>
          </Box>
        </Fade>
      )}

      {result && (
        <Fade in={true}>
          <Box sx={{ mt: 2 }}>
            <Alert severity={result.success ? 'success' : 'error'} sx={{ width: '100%' }} variant="filled">
              {result.success ? (
                <Typography>
                  QR Code processed successfully!
                </Typography>
              ) : (
                <Typography>{result.error}</Typography>
              )}
            </Alert>
          </Box>
        </Fade>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png,image/jpeg,image/gif,image/webp"
        style={{ display: 'none' }}
        aria-label="Upload QR code image"
      />

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
        {!result && !isProcessing && (
          <Fade in={true}>
            <Box>
              <Button
                variant="contained"
                startIcon={<UploadIcon />}
                onClick={() => fileInputRef.current?.click()}
                sx={{
                  background: 'linear-gradient(45deg, #2563eb, #7c3aed)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1e40af, #5b21b6)',
                  }
                }}
              >
                Select Image
              </Button>
            </Box>
          </Fade>
        )}

        {result?.success && result.content && (
          <Zoom in={true}>
            <Box sx={{ mt: 2 }}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  bgcolor: 'background.paper',
                  borderRadius: 2
                }}
              >
                <Typography variant="h6" gutterBottom>
                  QR Code Content:
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    wordBreak: 'break-all',
                    fontFamily: 'monospace',
                    bgcolor: 'grey.100',
                    p: 2,
                    borderRadius: 1,
                    mb: 2
                  }}
                >
                  {result.content}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<ContentCopyIcon />}
                    onClick={handleCopy}
                    sx={{
                      background: 'linear-gradient(45deg, #2563eb, #7c3aed)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #1e40af, #5b21b6)',
                      }
                    }}
                  >
                    Copy
                  </Button>
                  {isValidUrl(result.content) && (
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<OpenInNewIcon />}
                      onClick={handleOpenUrl}
                      sx={{
                        background: 'linear-gradient(45deg, #2563eb, #7c3aed)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #1e40af, #5b21b6)',
                        }
                      }}
                    >
                      Open URL
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<ShareIcon />}
                    onClick={handleShare}
                    sx={{
                      background: 'linear-gradient(45deg, #2563eb, #7c3aed)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #1e40af, #5b21b6)',
                      }
                    }}
                  >
                    Share
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<RefreshIcon />}
                    onClick={resetProcessor}
                    sx={{
                      borderColor: 'primary.main',
                      color: 'primary.main',
                      '&:hover': {
                        borderColor: 'primary.dark',
                        bgcolor: 'action.hover'
                      }
                    }}
                  >
                    Process Another
                  </Button>
                </Box>
              </Paper>
            </Box>
          </Zoom>
        )}
      </Box>
    </Box>
  );
};

export default QRCodeProcessor;