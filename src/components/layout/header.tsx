'use client';

import { useState, useEffect } from 'react';
import { ApexLogo } from '@/components/icons/apex-logo';
import { StarIcon } from '@/components/icons/star-icon';
import { userProfile } from '@/lib/data';
import { WalletConnectDialog } from '@/components/wallet-connect-dialog';
import { useTonWallet } from '@tonconnect/ui-react';
import { Button } from '../ui/button';
import { Wallet } from 'lucide-react';

export default function Header() {
  const [formattedStars, setFormattedStars] = useState<string | number>(userProfile.stars);
  const wallet = useTonWallet();

  useEffect(() => {
    // This now correctly runs only on the client, avoiding the hydration error.
    setFormattedStars(userProfile.stars.toLocaleString());
  }, []);

  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ApexLogo className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold font-headline text-foreground">Apex Gift</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-card px-3 py-1.5 rounded-full border border-primary/30">
            <StarIcon className="w-5 h-5 text-yellow-400" />
            <span className="font-bold text-lg text-foreground">{formattedStars}</span>
          </div>
          {wallet ? (
             <Button
                size="sm"
                variant={'secondary'}
                className="border-primary/50 text-primary"
              >
                <Wallet className="mr-2 h-4 w-4" />
                {formatAddress(wallet.account.address)}
              </Button>
          ) : (
            <WalletConnectDialog />
          )}
        </div>
      </div>
    </header>
  );
}
