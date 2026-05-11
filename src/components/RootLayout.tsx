'use client';

import React, { SessionProvider } from 'next-auth/react';
import { BurgerMenu } from '@/components/BurgerMenu';

interface RootLayoutProps {
  children: React.ReactNode;
}

export const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
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
