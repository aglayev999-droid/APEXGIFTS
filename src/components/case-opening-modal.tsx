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
import { StarIcon } from './icons/star-icon';
import { Gift, ChevronDown } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const REEL_ITEM_WIDTH = 144; // w-36
const REEL_SPIN_DURATION_MS = 5000;

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
                {caseItem.cost > 0 && <StarIcon className="w-5 h-5 fill-yellow-400 stroke-yellow-600" />}
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
                    <div key={prize.id} className="p-2 bg-card rounded-md flex items-center justify-center aspect-square">
                      <Image src={prize.imageUrl} alt={prize.description} width={64} height={64} className="object-contain" data-ai-hint={prize.imageHint} />
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
      <div className="absolute top-1/2 -translate-y-[calc(50%+6rem)] w-4 h-4 bg-primary transform rotate-45 z-20"></div>
      <div className="absolute top-1/2 translate-y-[calc(50%+6rem)] w-4 h-4 bg-primary transform rotate-45 z-20"></div>

      <div className="text-center absolute top-10">
        <h2 className="text-3xl font-bold font-headline">{isSpinning ? 'Spinning...' : 'You Won!'}</h2>
      </div>

      <div className='relative w-full'>
        <div
            className={cn('flex items-center will-change-transform', isSpinning && 'animate-reel-spin')}
            style={{
                '--reel-spin-to': `${reelSpinTo}px`,
                '--reel-spin-duration': `${REEL_SPIN_DURATION_MS}ms`
            } as React.CSSProperties}
        >
            {reelItems.map((prize, index) => (
            <div key={index} className="flex-shrink-0 w-36 h-36 p-2">
                <div className="bg-background/50 rounded-xl w-full h-full flex items-center justify-center p-2">
                    <Image
                        src={prize.imageUrl}
                        alt={prize.description}
                        width={128}
                        height={128}
                        className="object-contain w-full h-full transition-all"
                        data-ai-hint={prize.imageHint}
                    />
                </div>
            </div>
            ))}
        </div>
      </div>
    </div>
  );

  const renderWonView = () => (
     <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-card/80">
        <h2 className="text-3xl font-bold font-headline mb-4">You Won!</h2>
        <div className="relative w-40 h-40 bg-background rounded-lg p-2 border-2 border-primary shadow-2xl shadow-primary/30 mb-4">
             <Image
                src={wonPrize!.imageUrl}
                alt={wonPrize!.description}
                fill
                className="object-contain"
                data-ai-hint={wonPrize!.imageHint}
            />
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        {children}
      </DialogTrigger>
      <DialogContent className="w-full h-full max-h-full sm:max-w-full sm:h-full p-0 bg-transparent border-none flex flex-col">
        {!isSpinning && !wonPrize ? renderInitialView() : null}
        {isSpinning && !wonPrize ? renderSpinningView() : null}
        {!isSpinning && wonPrize ? renderWonView() : null}
      </DialogContent>
    </Dialog>
  );
}
