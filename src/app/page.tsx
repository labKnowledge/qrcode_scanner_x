// pages/index.tsx or app/page.tsx
'use client';
import React from 'react';
import { Container, Typography, Box, AppBar, Toolbar, Button, Link as MuiLink } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import Link from 'next/link';
import 'react-toastify/dist/ReactToastify.css';
import QRCodeProcessor from '../components/QRCodeProcessor';
import ClientThemeProvider from '../components/ClientThemeProvider';

export default function Home() {
  return (
    <ClientThemeProvider>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar position="static" color="default" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
          <Toolbar>
            <Link href="/" style={{ textDecoration: 'none', color: 'inherit', flexGrow: 1 }}>
              <Typography variant="h6" component="span" sx={{ fontWeight: 600 }}>
                ScanPro
              </Typography>
            </Link>
            <Link href="/">
              <Button color="inherit">Home</Button>
            </Link>
            <Link href="/contact">
              <Button color="inherit">Contact</Button>
            </Link>
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
                © 2024 ScanPro. All rights reserved.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                  <MuiLink color="inherit" href="/privacy-policy" underline="hover">Privacy</MuiLink>
                
                  <MuiLink color="inherit" href="/terms-of-service" underline="hover">Terms</MuiLink>
                
                  <MuiLink color="inherit" href="/contact" underline="hover">Contact</MuiLink>
                  
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
    </ClientThemeProvider>
  );
}