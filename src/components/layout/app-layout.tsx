
'use client';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import Header from './header';
import BottomNav from './bottom-nav';
import { TonConnectUIProvider } from '@tonconnect/ui-react';

function SplashScreen() {
    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-background">
            <div className="relative flex flex-col items-center gap-4">
                <h1 className="text-7xl font-bold tracking-widest text-primary animate-splash-total">
                    APEX
                </h1>
            </div>
        </div>
    );
}


export default function AppLayout({ children }: { children: ReactNode }) {
  const [manifestUrl, setManifestUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This ensures the window object is available before setting the URL.
    if (typeof window !== 'undefined') {
      setManifestUrl(`${window.location.origin}/tonconnect-manifest.json`);
    }
    
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.ready();
    }

    // Hide splash screen after animation
    const timer = setTimeout(() => {
        setIsLoading(false);
    }, 3500); // Must match the duration of the splash-total-animation in globals.css

    return () => clearTimeout(timer);

  }, []);
  
  if (isLoading) {
    return <SplashScreen />;
  }


  // Don't render the provider until the manifestUrl is set on the client
  if (!manifestUrl) {
    return null; // or a minimal loading state that doesn't show the main layout
  }

  return (
    <TonConnectUIProvider 
      manifestUrl={manifestUrl}
      walletsListConfiguration={{
        includeWallets: [
          {
            appName: "tonkeeper",
            name: "Tonkeeper",
            imageUrl: "https://s.tonkeeper.com/ton-connect/logo.png",
            aboutUrl: "https://tonkeeper.com",
            universalLink: "https://app.tonkeeper.com/ton-connect",
            bridgeUrl: "https://bridge.tonapi.io/bridge",
            jsBridgeKey: "tonkeeper",
            platforms: ["ios", "android", "chrome", "firefox"]
          },
          {
            appName: 'mytonwallet',
            name: 'MyTonWallet',
            imageUrl: 'https://mytonwallet.io/icon-256.png',
            aboutUrl: 'https://mytonwallet.io',
            universalLink: 'https://app.mytonwallet.io/ton-connect',
            jsBridgeKey: 'mytonwallet',
            bridgeUrl: 'https://mytonwallet.io/ton-connect',
            platforms: ['chrome', 'windows', 'macos', 'linux', 'android'],
          },
          {
            appName: "tonhub",
            name: "Tonhub",
            imageUrl: "https://tonhub.com/tonconnect.png",
            aboutUrl: "https://tonhub.com",
            universalLink: "https://tonhub.com/ton-connect",
            bridgeUrl: "https://connect.tonhub.com/tonconnect",
            jsBridgeKey: "tonhub",
            platforms: ["ios", "android"]
          },
        ]
      }}
      actionsConfiguration={{
        twaReturnUrl: 'https://t.me/apexgiftbot'
      }}
    >
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

declare global {
  interface Window {
    Telegram: any;
  }
}
