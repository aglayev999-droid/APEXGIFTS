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
    
    const invoiceSlug = 'YOUR_INVOICE_SLUG';

    if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
      if (invoiceSlug === 'YOUR_INVOICE_SLUG') {
        toast({
          title: 'Configuration Needed',
          description: 'Please replace "YOUR_INVOICE_SLUG" in src/components/deposit-stars.tsx with a real invoice slug from BotFather.',
          variant: 'destructive',
          duration: 5000,
        });
        setIsDepositing(false);
        return;
      }
      
      const tg = window.Telegram.WebApp;
      tg.ready();
      
      tg.openInvoice(invoiceSlug, (status: 'paid' | 'cancelled' | 'failed' | 'pending') => {
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
