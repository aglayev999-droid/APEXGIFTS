
'use client';

import { useState, type ReactNode } from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { Case, ImagePlaceholder } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Gift } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const REEL_ITEM_WIDTH = 144; // w-36
const REEL_SPIN_DURATION_MS = 5000;

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
              <Image src="https://i.ibb.co/RkKvqDcd/stars.png" alt="Stars" width={12} height={12} />
              <span className='font-bold'>{prize.price}</span>
            </div>
          )}
        </div>
    </div>
  )
}

export function CaseOpeningModal({
  children,
  caseItem,
  userStars,
}: {
  children: ReactNode;
  caseItem: Case;
  userStars: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wonPrize, setWonPrize] = useState<ImagePlaceholder | null>(null);
  const [reelItems, setReelItems] = useState<ImagePlaceholder[]>([]);
  const [reelSpinTo, setReelSpinTo] = useState(0);

  const { toast } = useToast();

  const handleOpenCase = () => {
    if (userStars < caseItem.cost && caseItem.cost > 0) {
      toast({
        title: 'Not enough stars!',
        description: `You need ${caseItem.cost} stars to open this case.`,
        variant: 'destructive',
      });
      return;
    }
    
    setWonPrize(null);
    setIsSpinning(true);

    const extendedReel = Array(10)
      .fill(null)
      .flatMap(() => [...caseItem.prizes].sort(() => Math.random() - 0.5));
    setReelItems(extendedReel);

    const prizeIndex = Math.floor(Math.random() * caseItem.prizes.length);
    const finalPrize = caseItem.prizes[prizeIndex];
    
    // Target an item in the 8th segment of the reel
    const targetIndex = extendedReel.length - caseItem.prizes.length * 2 + prizeIndex;
    
    // Calculate final position
    // Center of screen - half width of item + random offset within item
    const finalPosition = -(targetIndex * REEL_ITEM_WIDTH - (window.innerWidth / 2) + (REEL_ITEM_WIDTH / 2) - (Math.random() * 80 - 40));
    
    setReelSpinTo(finalPosition);
    
    setTimeout(() => {
      setIsSpinning(false);
      setWonPrize(finalPrize);
    }, REEL_SPIN_DURATION_MS);
  };

  const reset = () => {
    setIsOpen(false);
    setWonPrize(null);
    setIsSpinning(false);
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
          <p className="text-muted-foreground mt-4">You are about to open this case.</p>
      </div>
      
      <DialogFooter className="p-4 flex flex-col gap-2 border-t border-border">
          <Button 
            size="lg" 
            className="w-full h-12 text-lg" 
            onClick={handleOpenCase}
          >
              <div className='flex items-center justify-center gap-2'>
                <span>{caseItem.cost > 0 ? `Spin for ${caseItem.cost}`: 'Spin for Free'}</span>
                {caseItem.cost > 0 && <Image src="https://i.ibb.co/RkKvqDcd/stars.png" alt="Stars" width={20} height={20} />}
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
    <div className="h-full flex flex-col items-center justify-center relative overflow-hidden bg-card/80">
      <div className="absolute top-1/2 -translate-y-[calc(50%+7rem)] w-4 h-4 bg-primary transform rotate-45 z-20"></div>
      <div className="absolute top-1/2 translate-y-[calc(50%+7rem)] w-4 h-4 bg-primary transform rotate-45 z-20"></div>

      <div className="text-center absolute top-10">
        <h2 className="text-3xl font-bold font-headline">{isSpinning ? 'Spinning...' : 'You Won!'}</h2>
      </div>

      <div className='relative w-full h-40 flex items-center'>
        <div
            className={cn('flex items-center will-change-transform', isSpinning && 'animate-reel-spin')}
            style={{
                '--reel-spin-to': `${reelSpinTo}px`,
                animationDuration: `${REEL_SPIN_DURATION_MS}ms`
            } as React.CSSProperties}
        >
            {reelItems.map((prize, index) => (
              <div key={index} className="flex-shrink-0 w-36 h-36 p-2">
                  <PrizeDisplay prize={prize} className="transition-transform duration-500" />
              </div>
            ))}
        </div>
      </div>
    </div>
  );

  const renderWonView = () => (
     <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-card/80">
        <h2 className="text-3xl font-bold font-headline mb-4">You Won!</h2>
        <div className="relative w-48 h-48 bg-background/50 rounded-lg p-2 border-2 border-primary shadow-2xl shadow-primary/30 mb-4">
             <PrizeDisplay prize={wonPrize!} />
        </div>
        <h3 className="text-xl font-bold font-headline">{wonPrize!.description}</h3>
        <p className="text-muted-foreground mb-6">has been added to your inventory.</p>
        <div className="flex flex-col gap-2 w-full">
            <Button onClick={() => {
                // In a real app, you would navigate to inventory
                reset();
            }}>
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
        {!wonPrize ? (isSpinning ? renderSpinningView() : renderInitialView()) : renderWonView()}
      </DialogContent>
    </Dialog>
  );
}
