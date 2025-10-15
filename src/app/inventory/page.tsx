import Image from 'next/image';
import { inventory } from '@/lib/data';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gift } from 'lucide-react';

export default function InventoryPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline tracking-tight text-primary">My Collection</h1>
        <p className="text-muted-foreground mt-2">All the awesome NFTs you've collected.</p>
      </div>

      {inventory.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {inventory.map((item) => (
            <Card key={item.id} className="bg-card/50 backdrop-blur-sm border-primary/20 overflow-hidden group">
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
              </CardHeader>
              <CardFooter className="p-3 pt-0">
                <Button size="sm" className="w-full">
                  <Gift className="mr-2 h-4 w-4" />
                  Gift
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
