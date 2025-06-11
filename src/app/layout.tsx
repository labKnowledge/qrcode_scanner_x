// app/layout.tsx (for App Router)
import type { Metadata } from 'next';
import ClientThemeProvider from '../components/ClientThemeProvider';
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
      <body>
        <ClientThemeProvider>
          {children}
        </ClientThemeProvider>
      </body>
    </html>
  );
}