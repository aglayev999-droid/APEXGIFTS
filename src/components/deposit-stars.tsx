'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/context/language-context';

export function DepositStars() {
  const { t } = useTranslation();
  const [isDepositing, setIsDepositing] = useState(false);
  const { toast } = useToast();

  const handleDeposit = () => {
    setIsDepositing(true);
    
    // IMPORTANT: Replace this with the actual invoice slug you get from your payment provider bot via @BotFather.
    // This is NOT the payment provider token. This is a link to a specific product invoice.
    // Example: 'buy_1000_stars'
    const invoiceSlug = 'YOUR_INVOICE_SLUG';

    if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
      // Check if the slug is still the default placeholder
      if (invoiceSlug === 'YOUR_INVOICE_SLUG') {
        toast({
          title: t('Configuration Needed'),
          description: t('Please replace "YOUR_INVOICE_SLUG" in src/components/deposit-stars.tsx with a real invoice slug from BotFather.'),
          variant: 'destructive',
          duration: 9000, // Increased duration to allow reading
        });
        setIsDepositing(false);
        return;
      }
      
      const tg = window.Telegram.WebApp;
      tg.ready();
      
      // This function opens the payment interface for a specific invoice
      tg.openInvoice(invoiceSlug, (status: 'paid' | 'cancelled' | 'failed' | 'pending') => {
        setIsDepositing(false);
        if (status === 'paid') {
          toast({
            title: t('Deposit Successful!'),
            description: t('Your stars have been added to your account.'),
          });
          // TODO: Here you would typically update the user's star balance in your database
          // For now, we can just show a success message.
        } else if (status === 'failed') {
          toast({
            title: t('Deposit Failed'),
            description: t('Something went wrong. Please try again.'),
            variant: 'destructive',
          });
        }
        // You can also handle 'cancelled' and 'pending' statuses if needed
      });
    } else {
        toast({
            title: t('Telegram Only Feature'),
            description: t('Deposits can only be made within the Telegram app.'),
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
      {isDepositing ? t('Processing...') : t('Deposit')}
    </Button>
  );
}
