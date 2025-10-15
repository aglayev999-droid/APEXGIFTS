'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/context/language-context';

// Function to generate a unique slug for each transaction
function generateInvoiceSlug() {
    return 'deposit_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
}

export function DepositStars() {
  const { t } = useTranslation();
  const [isDepositing, setIsDepositing] = useState(false);
  const { toast } = useToast();

  const handleDeposit = () => {
    setIsDepositing(true);
    
    if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();

      const invoiceSlug = generateInvoiceSlug();
      
      // This function opens the payment interface using Telegram Stars
      tg.showInvoice({ slug: invoiceSlug }, (status: 'paid' | 'cancelled' | 'failed' | 'pending') => {
        setIsDepositing(false);
        if (status === 'paid') {
          toast({
            title: t('Deposit Successful!'),
            description: t('Your stars have been added to your account.'),
          });
          // IMPORTANT: You need to verify the payment on your backend
          // and credit the stars to the user's account.
        } else if (status === 'failed') {
          toast({
            title: t('Deposit Failed'),
            description: t('Something went wrong. Please try again.'),
            variant: 'destructive',
          });
        }
        // Handle 'cancelled' and 'pending' statuses if needed
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

// Add this to your global types or a declarations file (e.g., globals.d.ts)
declare global {
  interface Window {
    Telegram: any;
  }
}
