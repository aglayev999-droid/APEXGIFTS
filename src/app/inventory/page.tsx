
'use client';
import Image from 'next/image';
import { inventory, removeInventoryItem, userProfile } from '@/lib/data';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PiggyBank, ShoppingCart, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useTranslation } from '@/context/language-context';

export default function InventoryPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [_, setForceRender] = useState(0); // Used to force re-render
  const router = useRouter();

  const handleSellItem = (itemId: string, price: number) => {
    removeInventoryItem(itemId);
    userProfile.stars += price;
    toast({
      title: t('Item Sold!'),
      description: t('You have received {{price}} stars.', { price }),
    });
    // Force a re-render to update the inventory list and potentially the header
    setForceRender(Math.random()); 
  };
  
  const handleWithdrawItem = (itemName: string) => {
      if (userProfile.stars < 25) {
          toast({
              title: t('Not enough stars'),
              description: t('You need 25 stars to withdraw an item.'),
              variant: 'destructive',
          });
          return;
      }

      userProfile.stars -= 25;

      const text = t('Hi, I would like to withdraw my item: {{itemName}}', { itemName });
      const telegramUrl = `https://t.me/nullprime?text=${encodeURIComponent(text)}`;

      if (typeof window !== 'undefined') {
          window.open(telegramUrl, '_blank');
      }

      toast({
          title: t('Withdrawal Initiated'),
          description: t('You have been charged 25 stars. Please complete the process in Telegram.'),
      });
      setForceRender(Math.random());
  }

  const handleSellAll = () => {
    const totalValue = inventory.reduce((sum, item) => sum + (item.image.price || 0), 0);

    if (totalValue === 0) {
      toast({
        title: t('Nothing to sell'),
        description: t('You have no sellable items in your inventory.'),
        variant: 'destructive',
      });
      return;
    }
    
    userProfile.stars += totalValue;
    inventory.length = 0; // Clear the inventory array

    toast({
      title: t('All Items Sold!'),
      description: t('You have received {{totalValue}} stars.', { totalValue: totalValue.toLocaleString() }),
    });

    setForceRender(Math.random());
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline tracking-tight text-primary">{t('My Collection')}</h1>
        <p className="text-muted-foreground mt-2">{t("All the awesome NFTs you've collected.")}</p>
      </div>

      {inventory.length > 0 && (
          <div className="mb-6 flex justify-end">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {t('Sell All')}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t('Are you sure?')}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t('This will sell all items in your inventory. This action cannot be undone.')}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t('Cancel')}</AlertDialogCancel>
                  <AlertDialogAction onClick={handleSellAll} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                    {t('Confirm & Sell All')}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
      )}

      {inventory.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {inventory.map((item) => (
            <Card key={item.id} className="bg-card/50 backdrop-blur-sm border-primary/20 overflow-hidden group flex flex-col">
              <CardContent className="p-0 aspect-square relative">
                <Image
                  src={item.image.imageUrl}
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  data-ai-hint={item.image.imageHint}
                />
              </CardContent>
              <CardHeader className="p-3">
                <CardTitle className="text-sm font-semibold truncate">{item.name}</CardTitle>
                {item.image.price && (
                    <div className="flex items-center justify-start gap-1 text-xs text-yellow-400">
                      <Image src="https://i.ibb.co/fmx59f8/stars.png" alt="Stars" width={12} height={12} />
                      <span className='font-bold'>{item.image.price.toLocaleString()}</span>
                    </div>
                )}
              </CardHeader>
              <CardFooter className="p-3 pt-0 mt-auto grid grid-cols-2 gap-2">
                <Button size="sm" variant="outline" className="w-full" onClick={() => handleWithdrawItem(item.name)}>
                  <Send className="mr-2 h-4 w-4" />
                  {t('Withdraw')}
                </Button>
                <Button
                  size="sm"
                  className="w-full"
                  disabled={!item.image.price}
                  onClick={() => handleSellItem(item.id, item.image.price || 0)}
                >
                  <PiggyBank className="mr-2 h-4 w-4" />
                  {t('Sell')}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-muted-foreground text-lg">{t('Your inventory is empty.')}</p>
          <p className="text-muted-foreground">{t('Open some cases to start your collection!')}</p>
        </div>
      )}
    </div>
  );
}
