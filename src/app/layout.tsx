import type { Metadata } from 'next';
import localFont from 'next/font/local';
import type { ReactNode } from 'react';
import '../styles/global.css';
import LegacyServiceWorkerCleanup from './legacy-service-worker-cleanup';
import UmamiAnalytics from './umami-analytics';

const sans = localFont({
  src: './fonts/sans.woff2',
  variable: '--font-sans',
  weight: '100 900',
  display: 'swap',
});
const mono = localFont({
  src: './fonts/mono.woff2',
  variable: '--font-mono',
  weight: '100 900',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Wen Tjun',
  description:
    'Wen Tjun, a full-stack builder based in Singapore. I build real products with models, backed by the engineering to run them reliably.',
  icons: {
    icon: [
      {
        url: '/favicon.ico?v=mineral',
        sizes: '16x16 32x32 48x48',
        type: 'image/x-icon',
      },
      { url: '/favicon.svg?v=mineral', sizes: 'any', type: 'image/svg+xml' },
    ],
    apple: { url: '/apple-touch-icon.png?v=mineral', sizes: '180x180' },
  },
  manifest: '/manifest.webmanifest',
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body>
        <LegacyServiceWorkerCleanup />
        {children}
        <UmamiAnalytics />
      </body>
    </html>
  );
}
