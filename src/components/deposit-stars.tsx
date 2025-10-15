'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function DepositStars() {
  const [isDepositing, setIsDepositing] = useState(false);
  const { toast } = useToast();

  const handleDeposit = () => {
    toast({
        title: 'Telegram Only Feature',
        description: 'Deposits can only be made within the Telegram app.',
        variant: 'destructive',
      });
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
