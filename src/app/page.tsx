'use client';

import QRCodeProcessor from '../components/QRCodeProcessor';
import { Container, Typography, Box, Paper, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { 
  QrCode2 as QrCodeIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  CloudUpload as CloudUploadIcon,
  Analytics as AnalyticsIcon,
  Support as SupportIcon
} from '@mui/icons-material';

export default function Home() {
  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography 
            variant="h2" 
            component="h1" 
            sx={{ 
              fontWeight: 800,
              mb: 3,
              background: 'linear-gradient(45deg, #2563eb, #7c3aed)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent'
            }}
          >
            Professional QR Code Processing
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ mb: 4, maxWidth: '800px', mx: 'auto' }}>
            Enterprise-grade QR code scanning and processing solution for businesses and professionals
          </Typography>
        </Box>

        {/* Features Grid */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          <Grid xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 3, height: '100%', border: '1px solid', borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SpeedIcon sx={{ color: 'primary.main', mr: 1 }} />
                <Typography variant="h6" component="h3">Lightning Fast</Typography>
              </Box>
              <Typography color="text.secondary">
                Process QR codes in milliseconds with our optimized scanning engine
              </Typography>
            </Paper>
          </Grid>
          <Grid xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 3, height: '100%', border: '1px solid', borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SecurityIcon sx={{ color: 'primary.main', mr: 1 }} />
                <Typography variant="h6" component="h3">Secure Processing</Typography>
              </Box>
              <Typography color="text.secondary">
                Enterprise-grade security with end-to-end encryption
              </Typography>
            </Paper>
          </Grid>
          <Grid xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 3, height: '100%', border: '1px solid', borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AnalyticsIcon sx={{ color: 'primary.main', mr: 1 }} />
                <Typography variant="h6" component="h3">Advanced Analytics</Typography>
              </Box>
              <Typography color="text.secondary">
                Track and analyze your QR code processing metrics
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Main Scanner Section */}
        <Box sx={{ mb: 8 }}>
          <Paper elevation={0} sx={{ p: { xs: 3, md: 6 }, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 4 }}>
              Try Our Professional Scanner
            </Typography>
            <QRCodeProcessor />
          </Paper>
        </Box>

        {/* Premium Features */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 4, textAlign: 'center' }}>
            Premium Features
          </Typography>
          <Grid container spacing={4}>
            <Grid xs={12} md={6}>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CloudUploadIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Bulk Processing"
                    secondary="Process multiple QR codes simultaneously with our advanced batch processing system"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <AnalyticsIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Detailed Analytics"
                    secondary="Get comprehensive insights into your QR code processing patterns and performance"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <SupportIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Priority Support"
                    secondary="24/7 dedicated support for all your QR code processing needs"
                  />
                </ListItem>
              </List>
            </Grid>
            <Grid xs={12} md={6}>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <SecurityIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Advanced Security"
                    secondary="Enterprise-grade security features including audit logs and access controls"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <QrCodeIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Custom Branding"
                    secondary="White-label solution with your company's branding and custom integrations"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <SpeedIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="API Access"
                    secondary="Integrate our powerful QR code processing capabilities into your applications"
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
