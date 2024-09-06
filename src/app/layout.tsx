import type { Metadata } from 'next';

import { ReactNode } from 'react';
import Navigation from '@components/layout/navigation';
import Main from '@components/layout/main';
import Footer from '@components/layout/footer';

import './globals.css';
import { ThemeProvider } from 'next-themes';

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
      <body className={`antialiased dark:bg-nosferatu-900`}>
        <ThemeProvider attribute="class">
          <div className="mx-auto max-w-3xl px-6 lg:max-w-6xl lg:px-8 dark:text-dracula-200">
            <Navigation />
            <Main>{children}</Main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
