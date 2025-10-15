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
    
    if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();

      // This opens a link to the bot with a pre-filled command to start the deposit process.
      // The bot will then show an invoice.
      tg.openTelegramLink(`https://t.me/apexgiftbot?start=deposit`);

      // We don't know when the user will finish, so we can reset the button state after a short delay
      setTimeout(() => setIsDepositing(false), 3000);

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
