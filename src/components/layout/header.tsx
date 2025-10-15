'use client';

import { useState } from 'react';
import { ApexLogo } from '@/components/icons/apex-logo';
import { StarIcon } from '@/components/icons/star-icon';
import { userProfile } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';

export default function Header() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);

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
            <span className="font-bold text-lg text-foreground">{userProfile.stars.toLocaleString()}</span>
          </div>
          <Button
            size="sm"
            variant={isWalletConnected ? 'secondary' : 'outline'}
            className="border-primary/50 text-primary"
            onClick={() => setIsWalletConnected(!isWalletConnected)}
          >
            <Wallet className="mr-2 h-4 w-4" />
            {isWalletConnected ? 'Connected' : 'Connect'}
          </Button>
        </div>
      </div>
    </header>
  );
}
