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

      // This is a test invoice slug. The recipient is the bot that owns the app.
      // To use a real invoice, replace this with the slug from BotFather.
      // For more info, see: https://core.telegram.org/bots/payments/stars#test-invoices
      tg.openInvoice('test_invoice_100_stars', (status: 'paid' | 'cancelled' | 'failed' | 'pending') => {
        setIsDepositing(true);
        if (status === 'paid') {
          toast({
            title: 'Payment Successful!',
            description: 'Your stars have been added to your account.',
          });
          // Here you would typically update the user's star balance from your backend.
        } else if (status === 'failed') {
          toast({
            title: 'Payment Failed',
            description: 'Something went wrong. Please try again.',
            variant: 'destructive',
          });
        } else if (status === 'cancelled') {
           toast({
            title: 'Payment Cancelled',
            description: 'You have cancelled the payment process.',
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
