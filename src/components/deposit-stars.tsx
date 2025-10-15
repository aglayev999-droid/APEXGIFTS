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

      // The invoice slug must be created by your bot via BotFather's /mybots -> Payments -> Telegram Stars.
      // We are using a test invoice slug provided by Telegram for development.
      // To use a real invoice, replace this with the slug from BotFather.
      // For more info, see: https://core.telegram.org/bots/payments/stars#test-invoices
      tg.openInvoice('test_invoice_100_stars', (status) => {
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
