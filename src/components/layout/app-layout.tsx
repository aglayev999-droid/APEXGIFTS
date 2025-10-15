import type { ReactNode } from 'react';
import Header from './header';
import BottomNav from './bottom-nav';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow pt-16 pb-20">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
