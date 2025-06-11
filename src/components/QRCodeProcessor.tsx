"use client"
import { useState, useCallback, useRef, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress, Alert, Paper, Fade, Zoom } from '@mui/material';
import { Upload as UploadIcon, OpenInNew as OpenInNewIcon, Share as ShareIcon, Refresh as RefreshIcon } from '@mui/icons-material';
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
      
      await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = reject;
        image.src = imageUrl;
      });

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) {
        throw new Error('Could not get canvas context');
      }

      canvas.width = image.width;
      canvas.height = image.height;
      context.drawImage(image, 0, 0);
      
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      URL.revokeObjectURL(imageUrl);

      if (code) {
        processingResult = {
          success: true,
          content: code.data
        };
      } else {
        processingResult = {
          success: false,
          error: 'No QR code found in the image'
        };
      }
    } catch (err) {
      processingResult = {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to process image'
      };
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
      setError(err instanceof Error ? err.message : 'An error occurred while processing the image');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const dropzoneOptions: DropzoneOptions = {
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/gif': ['.gif']
    },
    maxFiles: 1,
    multiple: false,
    onDragEnter: () => {},
    onDragOver: () => {},
    onDragLeave: () => {}
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone(dropzoneOptions);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }
      processImage(file);
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
      window.open(result.content, '_blank');
    }
  };

  const handleShare = async () => {
    if (result?.success && result.content) {
      try {
        await navigator.share({
          title: 'QR Code Content',
          text: result.content,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    }
  };

  const resetProcessor = () => {
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!isClient) {
    return null; // Return null on server-side to prevent hydration mismatch
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
        <input {...getInputProps()} ref={undefined} />
        {isProcessing ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <CircularProgress />
            <Typography>Processing image...</Typography>
          </Box>
        ) : (
          <Box>
            <Typography variant="h6" gutterBottom>
              {isDragActive ? 'Drop the image here' : 'Drag & drop an image here, or click to select'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Supports PNG, JPG, JPEG, and GIF
            </Typography>
          </Box>
        )}
      </Box>

      {error && (
        <Box sx={{ mt: 2 }}>
          <Alert severity="error" sx={{ width: '100%' }} variant="filled">
            {error}
          </Alert>
        </Box>
      )}

      {result && (
        <Box sx={{ mt: 2 }}>
          <Alert severity={result.success ? 'success' : 'error'} sx={{ width: '100%' }} variant="filled">
            {result.success ? (
              <Typography>
                QR Code content: <strong>{result.content}</strong>
              </Typography>
            ) : (
              <Typography>{result.error}</Typography>
            )}
          </Alert>
        </Box>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png,image/jpeg,image/gif"
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

        {result && (
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
                <Typography
                  variant="body1"
                  sx={{
                    wordBreak: 'break-all',
                    fontFamily: 'monospace',
                    bgcolor: 'grey.100',
                    p: 2,
                    borderRadius: 1
                  }}
                >
                  {result.content}
                </Typography>
              </Paper>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mt: 2 }}>
                {result.success && result.content && isValidUrl(result.content) && (
                  <Button
                    variant="contained"
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
                {result.success && result.content && (
                  <Button
                    variant="contained"
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
                )}
                <Button
                  variant="outlined"
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
            </Box>
          </Zoom>
        )}
      </Box>
    </Box>
  );
};

export default QRCodeProcessor; 