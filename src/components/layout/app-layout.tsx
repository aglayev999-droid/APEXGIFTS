'use client';

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import Header from './header';
import BottomNav from './bottom-nav';
import { TonConnectUIProvider } from '@tonconnect/ui-react';

export default function AppLayout({ children }: { children: ReactNode }) {
  const manifestUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/tonconnect-manifest.json` 
    : '';

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.ready();
    }
  }, []);

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
