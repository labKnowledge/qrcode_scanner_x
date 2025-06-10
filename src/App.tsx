import React from 'react';
import { CssBaseline, ThemeProvider, createTheme, Container, Typography, Box } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import QRCodeProcessor from './components/QRCodeProcessor';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container>
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <Typography variant="h3" component="h1" gutterBottom>
            QR Code Processor
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Upload a QR code image to decode its content
          </Typography>
        </Box>
        <QRCodeProcessor />
      </Container>
      <ToastContainer position="bottom-right" />
    </ThemeProvider>
  );
}

export default App;
