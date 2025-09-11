import type { Metadata } from 'next';

import { ReactNode } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { ThemeProvider } from 'next-themes';
import dynamic from 'next/dynamic';
import WorkerComponent from '@components/worker-component';

import './globals.css';

const Header = dynamic(() => import('@components/layout/header'), {
  suspense: true,
});
const Main = dynamic(() => import('@components/layout/main'), {
  suspense: true,
});
const Footer = dynamic(() => import('@components/layout/footer'), {
  suspense: false,
});

export const metadata: Metadata = {
  title: `까먹을게 분명하기 때문에 기록하는 블로그`,
  description: '까먹을게 분명하기 때문에 기록하는 블로그',
  manifest: './manifest.json',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="min-h-screen bg-background antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <WorkerComponent />
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <Main>{children}</Main>
            <Footer />
          </div>
          <div id="portal-root" />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
