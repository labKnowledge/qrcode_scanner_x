// pages/index.tsx or app/page.tsx
'use client';
import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import QRCodeProcessor from '../components/QRCodeProcessor';

export default function Home() {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
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
  );
}