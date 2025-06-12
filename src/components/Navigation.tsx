'use client';
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container, Link as MuiLink } from '@mui/material';
import Link from 'next/link';
import { ToastContainer } from 'react-toastify';
import ScanCounter from './ScanCounter';

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
          {/* Scan Counter Section */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            mb: 4,
            p: 2,
            bgcolor: 'background.paper',
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider'
          }}>
            <ScanCounter />
          </Box>

          {/* Footer Links Section */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              © 2024 ScanPro. All rights reserved.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              
                <MuiLink color="inherit" href="/privacy-policy" style={{ textDecoration: 'none' }} underline="hover" sx={{ cursor: 'pointer' }}>Privacy</MuiLink>
              
              
                <MuiLink color="inherit" href="/terms-of-service" style={{ textDecoration: 'none' }} underline="hover" sx={{ cursor: 'pointer' }}>Terms</MuiLink>
              
              
                <MuiLink color="inherit" href="/contact" style={{ textDecoration: 'none' }} underline="hover" sx={{ cursor: 'pointer' }}>Contact</MuiLink>
              
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