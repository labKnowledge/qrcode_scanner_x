// app/layout.tsx (for App Router)
import type { Metadata } from 'next';
import ClientThemeProvider from '../components/ClientThemeProvider';
import Navigation from '../components/Navigation';
import 'react-toastify/dist/ReactToastify.css';

export const metadata: Metadata = {
  title: 'ScanCode - Professional QR Code Scanner',
  description: 'Professional QR code scanning and processing solution with modern interface',
  keywords: ['QR code', 'scanner', 'barcode', 'generator', 'scancode'],
  authors: [{ name: 'ScanCode Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#2563eb',
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/favicon-64x64.png', sizes: '64x64', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/favicon.svg',
        color: '#2563eb',
      },
    ],
  },
  openGraph: {
    title: 'ScanCode - Professional QR Code Scanner',
    description: 'Professional QR code scanning and processing solution',
    type: 'website',
    siteName: 'ScanCode',
  },
  twitter: {
    card: 'summary',
    title: 'ScanCode - Professional QR Code Scanner',
    description: 'Professional QR code scanning and processing solution',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
      <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7915052561240587"
        crossOrigin="anonymous"
      ></script>
      </head>
      <body>
      
        <ClientThemeProvider>
          <Navigation>
            {children}
          </Navigation>
        </ClientThemeProvider>
      </body>
    </html>
  );
}