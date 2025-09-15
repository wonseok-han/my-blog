import type { Metadata } from 'next';

import { ReactNode, Suspense } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { ThemeProvider } from 'next-themes';
import dynamic from 'next/dynamic';
import WorkerComponent from '@components/worker-component';

import './globals.css';
import { CustomQueryClientProvider } from '@components/providers/custom-query-client-provider';
import { PageSkeleton } from '@components/skeleton/page-skeleton';

const Header = dynamic(() => import('@components/layout/header'));
const Main = dynamic(() => import('@components/layout/main'));
const Footer = dynamic(() => import('@components/layout/footer'));

export const metadata: Metadata = {
  title: `까먹을게 분명하기 때문에 기록하는 블로그`,
  description:
    '개발 경험과 학습 내용을 기록하고 공유하는 공간입니다. 프론트엔드 개발, 웹 기술, 문제 해결 과정을 다룹니다.',
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
        <CustomQueryClientProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <WorkerComponent />
            <Suspense fallback={<PageSkeleton />}>
              <div className="relative flex min-h-screen flex-col">
                <Header />
                <Main>{children}</Main>
                <Footer />
              </div>
            </Suspense>
            <div id="portal-root" />
            <Analytics />
          </ThemeProvider>
        </CustomQueryClientProvider>
      </body>
    </html>
  );
}
