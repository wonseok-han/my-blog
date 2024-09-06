import type { Metadata } from 'next';

import { ReactNode } from 'react';
import Navigation from '@components/layout/navigation';
import Main from '@components/layout/main';
import Footer from '@components/layout/footer';

import './globals.css';

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
      <body className={`antialiased`}>
        <div className="mx-auto max-w-3xl px-6 lg:max-w-6xl lg:px-8">
          <Navigation />
          <Main>{children}</Main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
