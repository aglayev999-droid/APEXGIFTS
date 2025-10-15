'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Wallet, HelpCircle, Loader2 } from 'lucide-react';
import { TonkeeperIcon } from './icons/tonkeeper-icon';
import { MyTonWalletIcon } from './icons/mytonwallet-icon';
import { TonhubIcon } from './icons/tonhub-icon';
import { TonConnectIcon } from './icons/ton-connect-icon';
import { useTonConnectUI } from '@tonconnect/ui-react';
import type { WalletInfo } from '@tonconnect/ui-react';


const walletProviders = [
  { name: 'Tonkeeper', icon: <TonkeeperIcon className="w-12 h-12" />, appName: 'tonkeeper' as WalletInfo['appName'] },
  { name: 'MyTonWallet', icon: <MyTonWalletIcon className="w-12 h-12" />, appName: 'mytonwallet' as WalletInfo['appName'] },
  { name: 'Tonhub', icon: <TonhubIcon className="w-12 h-12" />, appName: 'tonhub' as WalletInfo['appName'] },
];

export function WalletConnectDialog() {
  const [tonConnectUI] = useTonConnectUI();
  const [isOpen, setIsOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async (walletAppName: WalletInfo['appName']) => {
    try {
        setIsConnecting(true);
        await tonConnectUI.openModal({
            walletsList: {
                // @ts-ignore
                'tonkeeper': {
                    appName: "tonkeeper",
                    name: "Tonkeeper",
                    imageUrl: "https://s.tonkeeper.com/ton-connect/logo.png",
                    aboutUrl: "https://tonkeeper.com",
                    universalLink: "https://app.tonkeeper.com/ton-connect",
                    bridgeUrl: "https://bridge.tonapi.io/bridge",
                    jsBridgeKey: "tonkeeper",
                    platforms: ["ios", "android", "chrome", "firefox"]
                },
            },
            appName: walletAppName,
        });
        setIsOpen(false);
    } catch (error) {
        console.error('Failed to connect wallet:', error);
    } finally {
        setIsConnecting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant={'outline'}
          className="border-primary/50 text-primary"
        >
          <Wallet className="mr-2 h-4 w-4" />
          {'Connect Wallet'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-card/80 backdrop-blur-lg border-primary/30 p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-2xl font-headline text-center">Connect your TON wallet</DialogTitle>
          <DialogDescription className="text-center">
            Choose your preferred wallet application to continue.
          </DialogDescription>
        </DialogHeader>
        <div className="p-6 pt-4 flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            {walletProviders.map((wallet) => (
              <div key={wallet.name} className="flex flex-col items-center gap-2 cursor-pointer group" onClick={() => !isConnecting && handleConnect(wallet.appName)}>
                <div className="p-2 rounded-xl bg-background/50 group-hover:bg-accent transition-colors relative">
                  {wallet.icon}
                  {isConnecting && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-xl">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  )}
                </div>
                <span className="text-xs font-medium">{wallet.name}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-4 p-3 rounded-lg bg-background/50">
            <div className='flex items-center gap-2'>
              <TonConnectIcon className="w-6 h-6" />
              <span className="font-semibold">TON Connect</span>
            </div>
            <HelpCircle className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
