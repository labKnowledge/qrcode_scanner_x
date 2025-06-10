import { useEffect, useRef, useState } from 'react';
import { BrowserQRCodeReader } from '@zxing/browser';
import type { IScannerControls } from '@zxing/browser';
import { Button, Box, Typography, Paper } from '@mui/material';
import { Share as ShareIcon, OpenInNew as OpenInNewIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';

const QRScanner = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const controlsRef = useRef<IScannerControls | null>(null);

  const startScanning = async () => {
    try {
      const codeReader = new BrowserQRCodeReader();
      const videoInputDevices = await BrowserQRCodeReader.listVideoInputDevices();
      
      if (videoInputDevices.length === 0) {
        toast.error('No camera devices found');
        return;
      }

      const selectedDeviceId = videoInputDevices[0].deviceId;
      
      controlsRef.current = await codeReader.decodeFromVideoDevice(
        selectedDeviceId,
        videoRef.current!,
        (result) => {
          if (result) {
            setScannedResult(result.getText());
            stopScanning();
          }
        }
      );
      
      setIsScanning(true);
    } catch (error) {
      toast.error('Error accessing camera');
      console.error(error);
    }
  };

  const stopScanning = () => {
    if (controlsRef.current) {
      controlsRef.current.stop();
      controlsRef.current = null;
    }
    setIsScanning(false);
  };

  const handleShare = async () => {
    if (scannedResult) {
      try {
        await navigator.share({
          title: 'Scanned QR Code',
          text: scannedResult,
        });
      } catch (error) {
        toast.error('Sharing not supported or failed');
      }
    }
  };

  const handleOpenUrl = () => {
    if (scannedResult && isValidUrl(scannedResult)) {
      window.open(scannedResult, '_blank');
    }
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const resetScanner = () => {
    setScannedResult(null);
    startScanning();
  };

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        <video
          ref={videoRef}
          style={{ width: '100%', maxHeight: '400px' }}
        />
      </Paper>

      {!isScanning && !scannedResult && (
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={startScanning}
        >
          Start Scanning
        </Button>
      )}

      {scannedResult && (
        <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Scanned Result:
          </Typography>
          <Typography variant="body1" sx={{ wordBreak: 'break-all', mb: 2 }}>
            {scannedResult}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {isValidUrl(scannedResult) && (
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
              onClick={resetScanner}
            >
              Scan Again
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default QRScanner;
