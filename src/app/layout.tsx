import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'PropFirmPassing — Professional Prop Firm Challenge Passing Service',
  description:
    'Pass your prop firm challenge in 7 days or less. Professional funded account passing service for FTMO, Funded Trader, E8, and all major prop firms. 95%+ pass rate guaranteed.',
  keywords: [
    'prop firm passing', 'FTMO passing', 'funded account', 'prop firm challenge',
    'forex prop firm', 'prop trading', 'challenge passing service',
  ],
  authors: [{ name: 'PropFirmPassing' }],
  openGraph: {
    title: 'PropFirmPassing — Pass Your Challenge in 7 Days',
    description: 'Professional prop firm challenge passing service. 95%+ pass rate.',
    url: 'https://propfirmpassing.online',
    siteName: 'PropFirmPassing',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PropFirmPassing — Pass Your Challenge in 7 Days',
    description: 'Professional prop firm challenge passing service.',
  },
  metadataBase: new URL('https://propfirmpassing.online'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        {children}
        <Toaster
          theme="dark"
          position="top-right"
          toastOptions={{
            style: {
              background: '#0a0f1e',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#f8fafc',
            },
          }}
        />
      </body>
    </html>
  );
}
