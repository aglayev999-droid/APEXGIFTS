'use client';

import { useState, useEffect, type ReactNode } from 'react';
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
import { StarIcon } from './icons/star-icon';
import { Gift } from 'lucide-react';

const REEL_ITEM_WIDTH = 144; // 128px width + 16px gap
const REEL_SPIN_DURATION = 5000; // in ms

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
  const [animationStyle, setAnimationStyle] = useState({});

  const { toast } = useToast();

  const handleOpenCase = () => {
    if (userStars < caseItem.cost) {
      toast({
        title: 'Not enough stars!',
        description: `You need ${caseItem.cost} stars to open this case.`,
        variant: 'destructive',
      });
      return;
    }
    
    // Reset state for a new spin
    setWonPrize(null);
    setIsSpinning(true);

    // Create a long reel of items for a good visual effect
    const extendedReel = Array(5)
      .fill(null)
      .flatMap(() => [...caseItem.prizes].sort(() => Math.random() - 0.5));
    setReelItems(extendedReel);

    // Determine the winning prize and its position
    const prizeIndex = Math.floor(Math.random() * caseItem.prizes.length);
    const finalPrize = caseItem.prizes[prizeIndex];
    
    // Find final prize in the second to last segment of the reel to ensure smooth stopping
    const targetIndex = extendedReel.length - caseItem.prizes.length * 2 + prizeIndex;
    
    // Calculate final position
    // Center of screen - half width of item + random offset within item
    const finalPosition = -(targetIndex * REEL_ITEM_WIDTH - (window.innerWidth / 2) + (REEL_ITEM_WIDTH / 2) - (Math.random() * 40 - 20));

    setAnimationStyle({ '--reel-spin-to': `translateX(${finalPosition}px)` });
    
    setTimeout(() => {
      setIsSpinning(false);
      setWonPrize(finalPrize);
    }, REEL_SPIN_DURATION);
  };

  const reset = () => {
    setIsOpen(false);
    setIsSpinning(false);
    setWonPrize(null);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[90vw] md:max-w-4xl bg-card/80 backdrop-blur-lg border-primary/30 p-0 overflow-hidden">
        {!isSpinning && !wonPrize && (
          <>
            <DialogHeader className="p-6">
              <DialogTitle className="text-2xl font-headline text-primary">Open {caseItem.name}?</DialogTitle>
              <DialogDescription>
                This will cost {caseItem.cost} stars from your balance. Are you sure you want to continue?
              </DialogDescription>
            </DialogHeader>
             <div className="px-6 relative flex justify-center items-center">
                <Image
                    src={caseItem.image.imageUrl}
                    alt={caseItem.name}
                    width={200}
                    height={250}
                    className="object-contain"
                    data-ai-hint={caseItem.image.imageHint}
                />
            </div>
            <DialogFooter className="p-6 bg-background/50">
              <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button onClick={handleOpenCase}>
                <StarIcon className="w-5 h-5 mr-2" />
                Proceed for {caseItem.cost} Stars
              </Button>
            </DialogFooter>
          </>
        )}

        {(isSpinning || wonPrize) && (
            <div className="h-96 flex flex-col items-center justify-center relative">
                <div className="absolute top-8 text-center">
                    <h2 className="text-2xl font-bold font-headline">{isSpinning ? 'Opening...' : 'You Won!'}</h2>
                </div>
                <div className="w-full relative h-40 flex items-center overflow-hidden">
                    <div className="absolute left-1/2 -translate-x-1/2 top-0 h-full w-1 bg-primary z-20 rounded-full shadow-lg shadow-primary/50"></div>
                     <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 h-44 w-44 rounded-full bg-primary/10 z-0"></div>

                    <div
                        className={cn('flex items-center absolute left-0 transition-transform', isSpinning && 'animate-reel-spin')}
                        style={animationStyle}
                    >
                        {reelItems.map((prize, index) => (
                        <div key={index} className="flex-shrink-0 w-32 h-32 p-2 mx-2">
                            <Image
                                src={prize.imageUrl}
                                alt={prize.description}
                                width={128}
                                height={128}
                                className="object-contain w-full h-full opacity-50"
                                data-ai-hint={prize.imageHint}
                            />
                        </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {wonPrize && !isSpinning && (
            <div className="bg-background/50 p-6 text-center -mt-16">
                 <div className="flex justify-center -translate-y-12">
                     <div className="relative w-40 h-40 bg-card rounded-lg p-2 border-2 border-primary shadow-2xl shadow-primary/30">
                         <Image
                            src={wonPrize.imageUrl}
                            alt={wonPrize.description}
                            fill
                            className="object-contain"
                            data-ai-hint={wonPrize.imageHint}
                        />
                     </div>
                 </div>
                <h3 className="text-xl font-bold font-headline">{wonPrize.description}</h3>
                <p className="text-muted-foreground mb-4">has been added to your inventory.</p>
                <div className="flex gap-4 justify-center">
                    <Button variant="outline" onClick={reset}>Close</Button>
                    <Button onClick={reset}>
                        <Gift className="mr-2 h-4 w-4" />
                        Go to Inventory
                    </Button>
                </div>
            </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
