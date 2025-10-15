
'use client';
import Image from 'next/image';
import { inventory, removeInventoryItem, userProfile } from '@/lib/data';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gift, PiggyBank } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function InventoryPage() {
  const { toast } = useToast();
  const [_, setForceRender] = useState(0); // Used to force re-render
  const router = useRouter();

  const handleSellItem = (itemId: string, price: number) => {
    removeInventoryItem(itemId);
    userProfile.stars += price;
    toast({
      title: 'Item Sold!',
      description: `You have received ${price} stars.`,
    });
    // Force a re-render to update the inventory list and potentially the header
    setForceRender(Math.random()); 
  };
  
  const handleGiftItem = () => {
      toast({
          title: 'Coming Soon!',
          description: 'Gifting functionality will be available in a future update.',
      });
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline tracking-tight text-primary">My Collection</h1>
        <p className="text-muted-foreground mt-2">All the awesome NFTs you've collected.</p>
      </div>

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
                      <Image src="https://i.ibb.co/RkKvqDcd/stars.png" alt="Stars" width={12} height={12} />
                      <span className='font-bold'>{item.image.price.toLocaleString()}</span>
                    </div>
                )}
              </CardHeader>
              <CardFooter className="p-3 pt-0 mt-auto grid grid-cols-2 gap-2">
                <Button size="sm" variant="outline" className="w-full" onClick={handleGiftItem}>
                  <Gift className="mr-2 h-4 w-4" />
                  Gift
                </Button>
                <Button
                  size="sm"
                  className="w-full"
                  disabled={!item.image.price}
                  onClick={() => handleSellItem(item.id, item.image.price || 0)}
                >
                  <PiggyBank className="mr-2 h-4 w-4" />
                  Sell
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-muted-foreground text-lg">Your inventory is empty.</p>
          <p className="text-muted-foreground">Open some cases to start your collection!</p>
        </div>
      )}
    </div>
  );
}
