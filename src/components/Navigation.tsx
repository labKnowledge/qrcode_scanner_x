'use client';
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container, Link as MuiLink } from '@mui/material';
import Link from 'next/link';
import { ToastContainer } from 'react-toastify';

const Navigation: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
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

      <Box sx={{ flex: 1 }}>
        {children}
      </Box>

      <Box component="footer" sx={{ py: 6, borderTop: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              © 2024 ScanPro. All rights reserved.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Link href="/privacy-policy" style={{ textDecoration: 'none' }}>
                <MuiLink color="inherit" underline="hover" sx={{ cursor: 'pointer' }}>Privacy</MuiLink>
              </Link>
              
              <Link href="/terms-of-service" style={{ textDecoration: 'none' }}>
                <MuiLink color="inherit" underline="hover" sx={{ cursor: 'pointer' }}>Terms</MuiLink>
              </Link>
              
              <Link href="/contact" style={{ textDecoration: 'none' }}>
                <MuiLink color="inherit" underline="hover" sx={{ cursor: 'pointer' }}>Contact</MuiLink>
              </Link>
            </Box>
          </Box>
        </Container>
      </Box>

      <ToastContainer 
        position="bottom-right"
        theme="light"
        style={{ fontSize: '14px' }}
      />
    </Box>
  );
};

export default Navigation; 