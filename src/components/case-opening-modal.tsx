
'use client';

import { useState, type ReactNode } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { Case, ImagePlaceholder } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Gift, Loader2 } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { addInventoryItem, userProfile } from '@/lib/data';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { ScrollArea } from './ui/scroll-area';

const REVEAL_DURATION_MS = 5000;
const REEL_ITEM_WIDTH = 128; // 8rem in pixels (w-32)
const MULTIPLIERS = [1, 3, 5, 10] as const;
type Multiplier = typeof MULTIPLIERS[number];

// Fisher-Yates shuffle algorithm
const shuffle = (array: any[]) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};

function PrizeDisplay({ prize, className }: { prize: ImagePlaceholder, className?: string }) {
  const isStarPrize = prize.description.includes('Stars');
  return (
    <div className={cn("bg-background/50 rounded-xl w-full h-full flex flex-col items-center justify-center p-2 text-center", className)}>
        <div className="relative w-full flex-grow">
            <Image
                src={prize.imageUrl}
                alt={prize.description}
                fill
                className="object-contain"
                data-ai-hint={prize.imageHint}
            />
        </div>
        <div className="mt-2 text-center">
          <p className="text-xs font-semibold truncate text-foreground">{prize.description}</p>
          {prize.price && !isStarPrize && (
            <div className="flex items-center justify-center gap-1 text-xs text-yellow-400">
              <Image src="https://i.ibb.co/fmx59f8/stars.png" alt="Stars" width={12} height={12} />
              <span className='font-bold'>{prize.price}</span>
            </div>
          )}
        </div>
    </div>
  )
}

interface Reel {
  id: number;
  items: ImagePlaceholder[];
  offset: number;
  winningPrize: ImagePlaceholder;
}

export function CaseOpeningModal({
  children,
  caseItem,
}: {
  children: ReactNode;
  caseItem: Case;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wonPrizes, setWonPrizes] = useState<ImagePlaceholder[]>([]);
  const [reels, setReels] = useState<Reel[]>([]);
  const [multiplier, setMultiplier] = useState<Multiplier>(1);
  
  const router = useRouter();
  const { toast } = useToast();
  const [_, setForceRender] = useState(0);

  const totalCost = caseItem.cost * multiplier;

  const handleOpenCase = () => {
    if (userProfile.stars < totalCost && caseItem.cost > 0) {
      toast({
        title: 'Not enough stars!',
        description: `You need ${totalCost} stars to open ${multiplier}x case(s).`,
        variant: 'destructive',
      });
      return;
    }
    
    setWonPrizes([]);
    setIsSpinning(true);
    
    if (caseItem.cost > 0) {
        userProfile.stars -= totalCost;
        setForceRender(Math.random());
    }

    const newReels: Reel[] = [];
    const finalPrizes: ImagePlaceholder[] = [];

    for (let i = 0; i < multiplier; i++) {
        const prizePool = caseItem.prizes;
        const shuffledPool = shuffle([...prizePool]);
        const reelItems = [...shuffledPool, ...shuffledPool, ...shuffledPool, ...shuffledPool, ...shuffledPool];
        const winningPrize = prizePool[Math.floor(Math.random() * prizePool.length)];
        
        let winningIndex = -1;
        for (let j = Math.floor(reelItems.length * 0.7); j < reelItems.length - 5; j++) {
            if (reelItems[j].id === winningPrize.id) {
                winningIndex = j;
                break;
            }
        }

        if (winningIndex === -1) {
            winningIndex = reelItems.length - 10;
            reelItems[winningIndex] = winningPrize;
        }

        finalPrizes.push(reelItems[winningIndex]);
        
        newReels.push({
            id: i,
            items: reelItems,
            offset: 0,
            winningPrize: reelItems[winningIndex],
        });
    }

    setReels(newReels);

    requestAnimationFrame(() => {
        setReels(prevReels => prevReels.map((reel, index) => {
             let winningIndex = -1;
             for (let j = Math.floor(reel.items.length * 0.7); j < reel.items.length - 5; j++) {
                if (reel.items[j].id === finalPrizes[index].id) {
                    winningIndex = j;
                    break;
                }
             }
             if (winningIndex === -1) { winningIndex = reel.items.length - 10; }

            const jitter = (Math.random() - 0.5) * (REEL_ITEM_WIDTH * 0.6);
            const targetOffset = (winningIndex * REEL_ITEM_WIDTH) - (REEL_ITEM_WIDTH / 2) + jitter;
            return { ...reel, offset: targetOffset };
        }));
    });

    setTimeout(() => {
      setIsSpinning(false);
      setWonPrizes(finalPrizes);
      
      finalPrizes.forEach(prize => {
          if (!prize.description.includes('Stars')) {
            addInventoryItem({
                id: `${prize.id}-${Date.now()}-${Math.random()}`,
                name: prize.description,
                image: prize,
            });
          } else {
            const starAmount = parseInt(prize.description.split(' ')[0]);
            if (!isNaN(starAmount)) {
                userProfile.stars += starAmount;
            }
          }
      });
      
      setForceRender(Math.random());
    }, REVEAL_DURATION_MS + 200);
  };

  const reset = () => {
    setIsOpen(false);
    setWonPrizes([]);
    setIsSpinning(false);
    setReels([]);
    setMultiplier(1);
  }

  const handleGoToInventory = () => {
    reset();
    router.push('/inventory');
  }

  const renderInitialView = () => (
    <div className='flex flex-col h-full'>
      <DialogHeader className="p-4 border-b border-border">
        <DialogTitle className="text-lg font-semibold text-center">{caseItem.name}</DialogTitle>
      </DialogHeader>
      
      <div className="flex-grow flex flex-col items-center justify-center p-6 text-center">
          <div className="relative w-48 h-48">
              <Image
                  src={caseItem.image.imageUrl}
                  alt={caseItem.name}
                  fill
                  className="object-contain"
                  data-ai-hint={caseItem.image.imageHint}
              />
          </div>
           {caseItem.cost > 0 && (
             <div className='mt-4 w-full'>
                <p className="text-muted-foreground mb-2">How many to open?</p>
                <RadioGroup 
                    defaultValue="1" 
                    className="grid grid-cols-4 gap-2"
                    onValueChange={(val) => setMultiplier(parseInt(val) as Multiplier)}
                >
                    {MULTIPLIERS.map(m => (
                        <div key={m}>
                            <RadioGroupItem value={m.toString()} id={`m-${m}`} className="sr-only" />
                            <Label htmlFor={`m-${m}`} className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground cursor-pointer [&:has([data-state=checked])]:border-primary">
                                {m}x
                            </Label>
                        </div>
                    ))}
                </RadioGroup>
             </div>
           )}
      </div>
      
      <DialogFooter className="p-4 flex flex-col gap-2 border-t border-border">
          <Button 
            size="lg" 
            className="w-full h-12 text-lg" 
            onClick={handleOpenCase}
            disabled={isSpinning}
          >
              <div className='flex items-center justify-center gap-2'>
                <span>{caseItem.cost > 0 ? `Spin for ${totalCost.toLocaleString()}`: 'Spin for Free'}</span>
                {caseItem.cost > 0 && <Image src="https://i.ibb.co/fmx59f8/stars.png" alt="Stars" width={20} height={20} />}
              </div>
          </Button>
           <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-none">
              <AccordionTrigger className="w-full h-12 bg-card/50 hover:no-underline rounded-lg px-4 justify-center gap-2 text-muted-foreground">
                <Gift className="w-5 h-5" />
                <span>Prizes Inside</span>
              </AccordionTrigger>
              <AccordionContent className="p-4 bg-background/80 rounded-b-lg">
                <div className="grid grid-cols-4 gap-2">
                  {caseItem.prizes.map(prize => (
                    <div key={prize.id} className="p-1 bg-card rounded-md aspect-square">
                        <PrizeDisplay prize={prize} />
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
      </DialogFooter>
    </div>
  );

  const renderSpinningView = () => (
    <div className="h-full flex flex-col items-center justify-center relative overflow-hidden bg-card/80 text-center p-6">
      <h2 className="text-3xl font-bold font-headline mb-4">Opening {multiplier > 1 ? `${multiplier} cases...` : '...'}</h2>
      <ScrollArea className="w-full flex-grow">
          <div className='flex flex-col items-center gap-4 py-4'>
            {reels.map((reel) => (
              <div key={reel.id} className="relative w-full h-32 flex items-center justify-center">
                {/* The Marker */}
                <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-0.5 h-36 bg-primary z-10 rounded-full" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-2 bg-primary z-10" style={{clipPath: 'polygon(50% 100%, 0 0, 100% 0)'}}/>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-2 bg-primary z-10" style={{clipPath: 'polygon(50% 0, 0 100%, 100% 100%)'}}/>
                
                {/* The Reel */}
                <div 
                  className="absolute left-1/2 h-full flex items-center transition-transform duration-5000 ease-out"
                  style={{ transform: `translateX(calc(-${reel.offset}px))` }}
                >
                  {reel.items.map((prize, index) => (
                    <div key={`${prize.id}-${index}`} className="w-32 h-32 shrink-0 p-2">
                      <div className="w-full h-full bg-background/30 rounded-lg p-1">
                        <PrizeDisplay prize={prize} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
      </ScrollArea>
    </div>
  );

  const renderWonView = () => (
     <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-card/80">
        <h2 className="text-3xl font-bold font-headline mb-4">You Won!</h2>
        <ScrollArea className='w-full max-w-md flex-grow my-4'>
            <div className="grid grid-cols-3 gap-2 p-1">
                {wonPrizes.map((prize, index) => (
                    <div key={`${prize.id}-${index}`} className="aspect-square">
                        <PrizeDisplay prize={prize} />
                    </div>
                ))}
            </div>
        </ScrollArea>
        <p className="text-muted-foreground mb-6">
            Your new items have been added to your inventory.
        </p>
        <div className="flex flex-col gap-2 w-full max-w-sm">
            <Button onClick={handleGoToInventory}>
                <Gift className="mr-2 h-4 w-4" />
                Go to Inventory
            </Button>
            <Button variant="outline" onClick={reset}>Close</Button>
        </div>
    </div>
  )

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) reset(); setIsOpen(open); }}>
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        {children}
      </DialogTrigger>
      <DialogContent className="w-full h-full max-h-full sm:max-w-full sm:h-full p-0 bg-transparent border-none flex flex-col">
        {wonPrizes.length === 0 ? (isSpinning ? renderSpinningView() : renderInitialView()) : renderWonView()}
      </DialogContent>
    </Dialog>
  );
}

