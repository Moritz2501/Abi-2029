'use client';

import type { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import { BurgerMenu } from '@/components/BurgerMenu';

interface RootLayoutProps {
  children: ReactNode;
}

export const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <SessionProvider>
      <div className="min-h-screen bg-dark-bg">
        <BurgerMenu />
        <main className="pt-8 pl-8 pr-8">
          {children}
        </main>
      </div>
    </SessionProvider>
  );
};
