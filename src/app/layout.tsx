// app/layout.tsx (for App Router)
import type { Metadata } from 'next';
import ClientThemeProvider from '../components/ClientThemeProvider';
import Navigation from '../components/Navigation';
import 'react-toastify/dist/ReactToastify.css';

export const metadata: Metadata = {
  title: 'ScanPro - QR Code Processor',
  description: 'Professional QR code scanning and processing solution',
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