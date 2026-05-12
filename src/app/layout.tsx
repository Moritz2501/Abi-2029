import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Providers } from './providers';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'ABI 2029 - Maria-Wächtler Gymnasium',
  description: 'Offizielle Web-App für den Abiturjahrgang 2029',
  keywords: ['Abitur', 'Gymnasium', 'ABI 2029', 'Maria-Wächtler'],
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0a0f1e" />
      </head>
      <body className="bg-dark-bg text-white">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
