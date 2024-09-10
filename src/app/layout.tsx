import type { Metadata } from 'next';

import { ReactNode } from 'react';
import Navigation from '@components/layout/navigation';
import Main from '@components/layout/main';
import Footer from '@components/layout/footer';
import { Analytics } from '@vercel/analytics/react';

import './globals.css';
import { ThemeProvider } from 'next-themes';
import Header from '@components/layout/header';

export const metadata: Metadata = {
  title: 'wonseok-han',
  description: "wonseok-han's blog",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased w-full dark:bg-nosferatu-900 light:white`}>
        <ThemeProvider attribute="class">
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
