import React from 'react';
import { CssBaseline, ThemeProvider, createTheme, Container, Typography, Box, AppBar, Toolbar, Button, Link } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import QRCodeProcessor from './components/QRCodeProcessor';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563eb',
      light: '#60a5fa',
      dark: '#1e40af',
    },
    secondary: {
      main: '#7c3aed',
      light: '#a78bfa',
      dark: '#5b21b6',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '10px 24px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        },
      },
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar position="static" color="default" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
              QR Pro
            </Typography>
            <Button color="inherit">Features</Button>
            <Button color="inherit">Pricing</Button>
            <Button color="inherit">Support</Button>
            <Button variant="contained" color="primary" sx={{ ml: 2 }}>
              Get Started
            </Button>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ flex: 1, py: 8 }}>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h1" component="h1" gutterBottom sx={{ 
              background: 'linear-gradient(45deg, #2563eb, #7c3aed)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              mb: 2
            }}>
              QR Code Processor
            </Typography>
            <Typography variant="h5" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto', mb: 4 }}>
              Professional QR code scanning and processing solution for your business needs
            </Typography>
          </Box>
          <QRCodeProcessor />
        </Container>

        <Box component="footer" sx={{ py: 6, borderTop: '1px solid', borderColor: 'divider' }}>
          <Container maxWidth="lg">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                © 2024 QR Pro. All rights reserved.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Link href="#" color="inherit" underline="hover">Privacy</Link>
                <Link href="#" color="inherit" underline="hover">Terms</Link>
                <Link href="#" color="inherit" underline="hover">Contact</Link>
              </Box>
            </Box>
          </Container>
        </Box>
      </Box>
      <ToastContainer 
        position="bottom-right"
        theme="light"
        style={{ fontSize: '14px' }}
      />
    </ThemeProvider>
  );
}

export default App;
