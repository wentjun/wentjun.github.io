import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '../styles/global.css';
import LegacyServiceWorkerCleanup from './legacy-service-worker-cleanup';

export const metadata: Metadata = {
  title: 'Wen Tjun',
  description:
    'Hi, I am Wen Tjun. I am a software engineer, specialising in front end development. Passionate about JavaScript/TypeScript, Web Development, and Design.',
  icons: {
    icon: '/favicon.ico',
  },
  manifest: '/manifest.webmanifest',
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <LegacyServiceWorkerCleanup />
        {children}
      </body>
    </html>
  );
}
