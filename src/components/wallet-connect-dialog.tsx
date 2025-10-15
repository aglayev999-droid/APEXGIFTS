'use client';

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
import { useTonConnectModal, useTonConnectUI } from '@tonconnect/ui-react';
import { WALLET_ID } from '@tonconnect/ui-react';


const walletProviders = [
  { name: 'Tonkeeper', icon: <TonkeeperIcon className="w-12 h-12" />, id: 'tonkeeper' as WALLET_ID },
  { name: 'MyTonWallet', icon: <MyTonWalletIcon className="w-12 h-12" />, id: 'mytonwallet' as WALLET_ID },
  { name: 'Tonhub', icon: <TonhubIcon className="w-12 h-12" />, id: 'tonhub' as WALLET_ID },
];

export function WalletConnectDialog() {
  const { open } = useTonConnectModal();
  const [tonConnectUI] = useTonConnectUI();

  const handleConnect = (walletId: WALLET_ID) => {
    tonConnectUI.connectWallet(walletId);
  };

  const handleTelegramConnect = () => {
    tonConnectUI.connectWallet('telegram-wallet');
  }

  return (
    <Dialog>
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
            Use Wallet in Telegram or choose other application
          </DialogDescription>
        </DialogHeader>
        <div className="p-6 pt-2 flex flex-col gap-4">
          <Button size="lg" className="w-full h-12 bg-primary/90 hover:bg-primary text-primary-foreground" onClick={handleTelegramConnect}>
            Connect Wallet in Telegram
            <Send className="ml-2 h-4 w-4" />
          </Button>

          <div className="text-center text-sm text-muted-foreground">Choose other application</div>

          <div className="grid grid-cols-3 gap-4 text-center">
            {walletProviders.map((wallet) => (
              <div key={wallet.name} className="flex flex-col items-center gap-2 cursor-pointer group" onClick={() => handleConnect(wallet.id)}>
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
