'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function DepositStars() {
  const [isDepositing, setIsDepositing] = useState(false);
  const { toast } = useToast();

  const handleDeposit = () => {
    if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();

      // Example: Open invoice for 100 stars
      // The invoice slug must be created by your bot via BotFather's /mybots -> Payments -> Telegram Stars.
      // Replace 'YOUR_INVOICE_SLUG' with the actual slug for a 100-star package.
      // You would typically have different slugs for different amounts.
      tg.openInvoice('YOUR_INVOICE_SLUG_FOR_100_STARS', (status) => {
        setIsDepositing(true);
        if (status === 'paid') {
          toast({
            title: 'Payment Successful!',
            description: 'Your stars have been added to your account.',
          });
          // Here you would also update the user's star balance in your backend
        } else if (status === 'failed') {
          toast({
            title: 'Payment Failed',
            description: 'Something went wrong. Please try again.',
            variant: 'destructive',
          });
        } else if (status === 'cancelled') {
           toast({
            title: 'Payment Cancelled',
            description: 'The payment process was cancelled.',
            variant: 'destructive',
          });
        }
        setIsDepositing(false);
      });
    } else {
      toast({
        title: 'Telegram Only Feature',
        description: 'Deposits can only be made within the Telegram app.',
        variant: 'destructive',
      });
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
