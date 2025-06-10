import React, { useState, useCallback, useRef } from 'react';
import { Box, Button, Typography, Paper, CircularProgress } from '@mui/material';
import { Upload as UploadIcon, OpenInNew as OpenInNewIcon, Share as ShareIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';

interface QRCode {
  data: string;
  location: {
    topRightCorner: { x: number; y: number };
    topLeftCorner: { x: number; y: number };
    bottomRightCorner: { x: number; y: number };
    bottomLeftCorner: { x: number; y: number };
  };
}

declare global {
  interface Window {
    jsQR: (
      imageData: Uint8ClampedArray,
      width: number,
      height: number,
      options?: {
        inversionAttempts?: 'dontInvert' | 'onlyInvert' | 'attemptBoth' | 'invertFirst';
      }
    ) => QRCode | null;
  }
}

const QRCodeProcessor = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [decodedContent, setDecodedContent] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processQRCode = useCallback(async (file: File) => {
    try {
      setIsProcessing(true);
      const image = new Image();
      const imageUrl = URL.createObjectURL(file);
      
      const timeoutId = setTimeout(() => {
        if (isProcessing) {
          setIsProcessing(false);
          toast.error('Processing timed out. Please try a smaller image or a different format.');
          URL.revokeObjectURL(imageUrl);
        }
      }, 10000);

      image.onload = () => {
        try {
          const canvas = document.createElement('canvas');
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

          // Draw image with white background
          context.fillStyle = 'white';
          context.fillRect(0, 0, width, height);
          
          // Use better quality image scaling
          context.imageSmoothingEnabled = true;
          context.imageSmoothingQuality = 'high';
          context.drawImage(image, 0, 0, width, height);

          const imageData = context.getImageData(0, 0, width, height);
          console.log('Processing image:', {
            originalWidth: image.width,
            originalHeight: image.height,
            scaledWidth: width,
            scaledHeight: height,
            scale,
            dataLength: imageData.data.length
          });

          const code = window.jsQR(imageData.data, width, height, {
            inversionAttempts: "dontInvert",
          });

          if (code) {
            console.log('Decoded QR code:', code);
            setDecodedContent(code.data);
            toast.success('QR Code successfully decoded!');
          } else {
            console.log('No QR code found in image');
            toast.error('No QR code found in the image. Please ensure the QR code is clear and well-lit.');
          }
        } catch (err) {
          console.error('Error processing image:', err);
          toast.error('Error processing image');
        } finally {
          clearTimeout(timeoutId);
          setIsProcessing(false);
          URL.revokeObjectURL(imageUrl);
        }
      };

      image.onerror = (err) => {
        console.error('Error loading image:', err);
        toast.error('Error loading image');
        clearTimeout(timeoutId);
        setIsProcessing(false);
        URL.revokeObjectURL(imageUrl);
      };

      image.src = imageUrl;
    } catch (err) {
      console.error('Error in processQRCode:', err);
      toast.error('Error processing QR code');
      setIsProcessing(false);
    }
  }, [isProcessing]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        // Check file size (limit to 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error('Image size should be less than 5MB');
          return;
        }
        processQRCode(file);
      } else {
        toast.error('Please upload an image file');
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleOpenUrl = () => {
    if (decodedContent && isValidUrl(decodedContent)) {
      window.open(decodedContent, '_blank');
    }
  };

  const handleShare = async () => {
    if (decodedContent) {
      try {
        await navigator.share({
          title: 'QR Code Content',
          text: decodedContent,
        });
      } catch (err) {
        console.error('Sharing error:', err);
        toast.error('Sharing not supported or failed');
      }
    }
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  const resetProcessor = () => {
    setDecodedContent(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        style={{ display: 'none' }}
      />
      
      <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
        {!decodedContent && !isProcessing && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<UploadIcon />}
            onClick={handleUploadClick}
            size="large"
          >
            Upload QR Code Image
          </Button>
        )}

        {isProcessing && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <CircularProgress />
            <Typography>Processing QR Code...</Typography>
          </Box>
        )}

        {decodedContent && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Decoded Content:
            </Typography>
            <Typography variant="body1" sx={{ wordBreak: 'break-all', mb: 2 }}>
              {decodedContent}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
              {isValidUrl(decodedContent) && (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<OpenInNewIcon />}
                  onClick={handleOpenUrl}
                >
                  Open URL
                </Button>
              )}
              <Button
                variant="contained"
                color="secondary"
                startIcon={<ShareIcon />}
                onClick={handleShare}
              >
                Share
              </Button>
              <Button
                variant="outlined"
                onClick={resetProcessor}
              >
                Upload Another
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default QRCodeProcessor; 