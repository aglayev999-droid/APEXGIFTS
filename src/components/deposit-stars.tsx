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
      
      // IMPORTANT: Replace 'YOUR_INVOICE_SLUG' with the real slug from BotFather.
      // To use a real invoice, replace this with the slug from BotFather.
      // For more info, see: https://core.telegram.org/bots/payments/stars#creating-invoices
      tg.openInvoice('YOUR_INVOICE_SLUG', (status: 'paid' | 'cancelled' | 'failed' | 'pending') => {
        setIsDepositing(false);
        if (status === 'paid') {
          toast({
            title: 'Deposit Successful!',
            description: 'Your stars have been added to your account.',
          });
          // Here you would typically update the user's star balance in your database.
        } else if (status === 'failed') {
          toast({
            title: 'Deposit Failed',
            description: 'Something went wrong. Please try again.',
            variant: 'destructive',
          });
        }
      });
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
