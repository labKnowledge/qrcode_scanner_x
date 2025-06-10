import React from 'react';
import { Container, Typography, Box, Paper, List, ListItem, ListItemText } from '@mui/material';

const PrivacyPolicy = () => {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={0} sx={{ p: { xs: 3, md: 6 }, borderRadius: 2 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ 
          fontWeight: 700,
          mb: 4,
          background: 'linear-gradient(45deg, #2563eb, #7c3aed)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent'
        }}>
          Privacy Policy
        </Typography>

        <Typography variant="body1" paragraph sx={{ mb: 4, color: 'text.secondary' }}>
          Last updated: {new Date().toLocaleDateString()}
        </Typography>

        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            Introduction
          </Typography>
          <Typography variant="body1" paragraph>
            At QR Pro, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our QR code processing service.
          </Typography>
        </Box>

        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            Information We Collect
          </Typography>
          <List>
            <ListItem sx={{ display: 'list-item', pl: 0 }}>
              <ListItemText 
                primary="QR Code Images"
                secondary="We process QR code images that you upload to our service. These images are processed in real-time and are not stored on our servers."
              />
            </ListItem>
            <ListItem sx={{ display: 'list-item', pl: 0 }}>
              <ListItemText 
                primary="Usage Data"
                secondary="We collect anonymous usage statistics to improve our service, including processing times and success rates."
              />
            </ListItem>
            <ListItem sx={{ display: 'list-item', pl: 0 }}>
              <ListItemText 
                primary="Device Information"
                secondary="We may collect information about your device, including browser type, operating system, and screen resolution."
              />
            </ListItem>
          </List>
        </Box>

        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            How We Use Your Information
          </Typography>
          <Typography variant="body1" paragraph>
            We use the information we collect to:
          </Typography>
          <List>
            <ListItem sx={{ display: 'list-item', pl: 0 }}>
              <ListItemText primary="Process and decode QR codes" />
            </ListItem>
            <ListItem sx={{ display: 'list-item', pl: 0 }}>
              <ListItemText primary="Improve our service and user experience" />
            </ListItem>
            <ListItem sx={{ display: 'list-item', pl: 0 }}>
              <ListItemText primary="Monitor and analyze usage patterns" />
            </ListItem>
            <ListItem sx={{ display: 'list-item', pl: 0 }}>
              <ListItemText primary="Prevent fraud and abuse" />
            </ListItem>
          </List>
        </Box>

        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            Data Security
          </Typography>
          <Typography variant="body1" paragraph>
            We implement appropriate technical and organizational measures to protect your information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
          </Typography>
        </Box>

        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            Your Rights
          </Typography>
          <Typography variant="body1" paragraph>
            You have the right to:
          </Typography>
          <List>
            <ListItem sx={{ display: 'list-item', pl: 0 }}>
              <ListItemText primary="Access your personal information" />
            </ListItem>
            <ListItem sx={{ display: 'list-item', pl: 0 }}>
              <ListItemText primary="Correct inaccurate information" />
            </ListItem>
            <ListItem sx={{ display: 'list-item', pl: 0 }}>
              <ListItemText primary="Request deletion of your information" />
            </ListItem>
            <ListItem sx={{ display: 'list-item', pl: 0 }}>
              <ListItemText primary="Object to processing of your information" />
            </ListItem>
          </List>
        </Box>

        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            Contact Us
          </Typography>
          <Typography variant="body1" paragraph>
            If you have any questions about this Privacy Policy, please contact us at:
          </Typography>
          <Typography variant="body1" sx={{ color: 'primary.main' }}>
            privacy@qrpro.com
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default PrivacyPolicy; 