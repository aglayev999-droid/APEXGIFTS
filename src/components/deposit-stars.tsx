'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function DepositStars() {
  const [isDepositing, setIsDepositing] = useState(false);
  const { toast } = useToast();

  const handleDeposit = () => {
    setIsDepositing(true);
    if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      
      // The openInvoice method is failing, so we'll open a link to the user instead.
      // This avoids the app crash and provides a path for the user to contact the recipient.
      tg.openTelegramLink('https://t.me/nullprime');
      
      // We can provide a toast to inform the user what happened.
      toast({
        title: 'Redirecting to User',
        description: 'You are being redirected to @nullprime to complete the transaction.',
      });
      setIsDepositing(false);

    } else {
        toast({
            title: 'Telegram Only Feature',
            description: 'Deposits can only be made within the Telegram app.',
            variant: 'destructive',
        });
        setIsDepositing(false);
    }
  };

  return (
    <Button className="w-full" onClick={handleDeposit} disabled={isDepositing}>
      {isDepositing ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <PlusCircle className="mr-2 h-4 w-4" />
      )}
      {isDepositing ? 'Processing...' : 'Deposit'}
    </Button>
  );
}
