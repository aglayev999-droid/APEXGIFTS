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
import { Wallet, HelpCircle, Send } from 'lucide-react';
import { TonkeeperIcon } from './icons/tonkeeper-icon';
import { MyTonWalletIcon } from './icons/mytonwallet-icon';
import { TonhubIcon } from './icons/tonhub-icon';
import { TonConnectIcon } from './icons/ton-connect-icon';

const walletProviders = [
  { name: 'Tonkeeper', icon: <TonkeeperIcon className="w-12 h-12" /> },
  { name: 'MyTonWallet', icon: <MyTonWalletIcon className="w-12 h-12" /> },
  { name: 'Tonhub', icon: <TonhubIcon className="w-12 h-12" /> },
];

export function WalletConnectDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const handleConnect = () => {
    // In a real app, you'd handle wallet connection logic here.
    setIsWalletConnected(true);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant={isWalletConnected ? 'secondary' : 'outline'}
          className="border-primary/50 text-primary"
        >
          <Wallet className="mr-2 h-4 w-4" />
          {isWalletConnected ? 'Connected' : 'Connect Wallet'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-card/80 backdrop-blur-lg border-primary/30 p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-2xl font-headline text-center">Connect your TON wallet</DialogTitle>
          <DialogDescription className="text-center">
            Use Wallet in Telegram or choose other application
          </DialogDescription>
        </DialogHeader>
        <div className="p-6 pt-2 flex flex-col gap-4">
          <Button size="lg" className="w-full h-12 bg-primary/90 hover:bg-primary text-primary-foreground" onClick={handleConnect}>
            Connect Wallet in Telegram
            <Send className="ml-2 h-4 w-4" />
          </Button>

          <div className="text-center text-sm text-muted-foreground">Choose other application</div>

          <div className="grid grid-cols-3 gap-4 text-center">
            {walletProviders.map((wallet) => (
              <div key={wallet.name} className="flex flex-col items-center gap-2 cursor-pointer group" onClick={handleConnect}>
                <div className="p-2 rounded-xl bg-background/50 group-hover:bg-accent transition-colors">
                  {wallet.icon}
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
