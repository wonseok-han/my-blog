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
const Navigation = dynamic(() => import('@components/layout/navigation'), {
  suspense: false,
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased w-full dark:bg-nosferatu-900`}>
        <ThemeProvider attribute="class">
          <WorkerComponent />
          <div className="mx-auto max-w-3xl px-6 lg:max-w-6xl lg:px-8 dark:text-dracula-200">
            <Navigation />
            <Header />
            <Main>{children}</Main>
            <Footer />
          </div>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
