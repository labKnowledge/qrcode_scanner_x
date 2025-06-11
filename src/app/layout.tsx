import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from 'next/link';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QR Pro - Professional QR Code Processing",
  description: "Professional QR code processing and scanning solution for businesses and individuals",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider theme={theme}>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
              <Container maxWidth="lg">
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                  <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
                      QR Pro
                    </Typography>
                  </Link>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button component={Link} href="/contact" color="inherit">
                      Contact
                    </Button>
                    <Button component={Link} href="/privacy-policy" color="inherit">
                      Privacy
                    </Button>
                    <Button component={Link} href="/terms-of-service" color="inherit">
                      Terms
                    </Button>
                  </Box>
                </Toolbar>
              </Container>
            </AppBar>

            <Box component="main" sx={{ flexGrow: 1 }}>
              {children}
            </Box>

            <Box component="footer" sx={{ py: 3, borderTop: '1px solid', borderColor: 'divider' }}>
              <Container maxWidth="lg">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    © {new Date().getFullYear()} QR Pro. All rights reserved.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button component={Link} href="/privacy-policy" size="small" color="inherit">
                      Privacy Policy
                    </Button>
                    <Button component={Link} href="/terms-of-service" size="small" color="inherit">
                      Terms of Service
                    </Button>
                    <Button component={Link} href="/contact" size="small" color="inherit">
                      Contact
                    </Button>
                  </Box>
                </Box>
              </Container>
            </Box>
          </Box>
        </ThemeProvider>
      </body>
    </html>
  );
}
