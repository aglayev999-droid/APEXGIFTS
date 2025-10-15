'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/context/language-context';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';


export function DepositStars() {
  const { t } = useTranslation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [amount, setAmount] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleDeposit = () => {
    const starAmount = parseInt(amount, 10);
    if (isNaN(starAmount) || starAmount <= 0) {
      toast({
        title: t('Invalid Amount'),
        description: t('Please enter a valid number of stars to deposit.'),
        variant: 'destructive',
      });
      return;
    }
    
    setIsProcessing(true);
    
    if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();

      // Open the link to the bot with a payload to start the deposit process.
      // e.g., deposit_500
      const payload = `deposit_${starAmount}`;
      tg.openTelegramLink(`https://t.me/apexgiftbot?start=${payload}`);
      
      setIsOpen(false);
      setAmount('');
      // We don't know when the user will finish, so we can reset the button state after a short delay
      setTimeout(() => setIsProcessing(false), 3000);

    } else {
        toast({
            title: t('Telegram Only Feature'),
            description: t('Deposits can only be made within the Telegram app.'),
            variant: 'destructive',
        });
        setIsProcessing(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button className="w-full">
          <PlusCircle className="mr-2 h-4 w-4" />
          {t('Deposit Stars')}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('Deposit Stars')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('Enter the amount of stars you want to add to your balance.')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              {t('Amount')}
            </Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={t('e.g., 500')}
              className="col-span-3"
            />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setAmount('')}>{t('Cancel')}</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeposit} disabled={isProcessing}>
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('Processing...')}
              </>
            ) : (
              t('Deposit')
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Add these new translation keys to your en.json, ru.json, uz.json files
// "Invalid Amount": "Invalid Amount",
// "Please enter a valid number of stars to deposit.": "Please enter a valid number of stars to deposit.",
// "Enter the amount of stars you want to add to your balance.": "Enter the amount of stars you want to add to your balance.",
// "Amount": "Amount",
// "e.g., 500": "e.g., 500"

declare global {
  interface Window {
    Telegram: any;
  }
}
