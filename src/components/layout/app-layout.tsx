'use client';

import type { ReactNode } from 'react';
import Header from './header';
import BottomNav from './bottom-nav';
import { TonConnectUIProvider } from '@tonconnect/ui-react';

export default function AppLayout({ children }: { children: ReactNode }) {
  const manifestUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/tonconnect-manifest.json` 
    : '';

  return (
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-grow pt-16 pb-20">
          {children}
        </main>
        <BottomNav />
      </div>
    </TonConnectUIProvider>
  );
}
