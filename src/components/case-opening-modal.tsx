
'use client';

import { useState, type ReactNode, useEffect } from 'react';
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
import type { Case, Prize } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Gift, Loader2, Percent } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { addInventoryItem, userProfile, updateLeaderboard } from '@/lib/data';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { ScrollArea } from './ui/scroll-area';
import { useTranslation } from '@/context/language-context';

const REVEAL_DURATION_MS = 5000;
const REEL_ITEM_WIDTH = 128; // 8rem in pixels (w-32)
const MULTIPLIERS = [1, 3, 5, 10] as const;
type Multiplier = typeof MULTIPLIERS[number];

type TelegramUser = {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
};

// Weighted random selection based on chance
const selectPrize = (prizes: Prize[]): Prize => {
  const totalChance = prizes.reduce((sum, prize) => sum + prize.chance, 0);
  let random = Math.random() * totalChance;
  for (const prize of prizes) {
    if (random < prize.chance) {
      return prize;
    }
    random -= prize.chance;
  }
  // Fallback in case of rounding errors
  return prizes[prizes.length - 1];
};


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

function PrizeDisplay({ prize, className, showChance, isWon = false }: { prize: Prize, className?: string, showChance?: boolean, isWon?: boolean }) {
  const isStarPrize = prize.description.includes('Stars');
  return (
    <div className={cn("bg-background/50 rounded-xl w-full h-full flex flex-col items-center justify-center p-2 text-center relative", className)}>
        <div className={cn("relative w-full flex-grow", isWon && "animate-won-shimmer")}>
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
        {showChance && (
            <div className='absolute top-1 right-1 bg-black/50 text-white rounded-full px-1.5 py-0.5 text-[10px] font-bold flex items-center gap-0.5'>
                <Percent className='w-2.5 h-2.5' />
                <span>{prize.chance}</span>
            </div>
        )}
    </div>
  )
}

interface Reel {
  id: number;
  items: Prize[];
  offset: number;
  winningPrize: Prize;
}

export function CaseOpeningModal({
  children,
  caseItem,
  onCaseOpened,
  isDisabled = false
}: {
  children: ReactNode;
  caseItem: Case;
  onCaseOpened?: () => void;
  isDisabled?: boolean;
}) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wonPrizes, setWonPrizes] = useState<Prize[]>([]);
  const [reels, setReels] = useState<Reel[]>([]);
  const [multiplier, setMultiplier] = useState<Multiplier>(1);
  const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null);
  
  const router = useRouter();
  const { toast } = useToast();
  const [_, setForceRender] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        if (tg.initDataUnsafe?.user) {
            setTelegramUser(tg.initDataUnsafe.user);
        }
    }
  }, []);

  const totalCost = caseItem.cost * multiplier;

  const handleOpenCase = () => {
    if (isDisabled) return;

    if (userProfile.stars < totalCost && caseItem.cost > 0) {
      toast({
        title: t('Not enough stars!'),
        description: t('You need {{totalCost}} stars to open {{multiplier}}x case(s).', { totalCost, multiplier }),
        variant: 'destructive',
      });
      return;
    }
    
    setWonPrizes([]);
    setIsSpinning(true);
    
    if (caseItem.cost > 0) {
        userProfile.stars -= totalCost;
    }

    if (telegramUser) {
        const currentUser = {
            name: `${telegramUser.first_name} ${telegramUser.last_name || ''}`.trim(),
            avatar: telegramUser.photo_url || ''
        };
        updateLeaderboard(currentUser, multiplier);
    }
    
    setForceRender(Math.random());
    onCaseOpened?.();

    const newReels: Reel[] = [];
    const finalPrizes: Prize[] = [];

    // First, determine all winning prizes
    for (let i = 0; i < multiplier; i++) {
        finalPrizes.push(selectPrize(caseItem.prizes));
    }

    // Then, construct the reels with the guaranteed prize
    finalPrizes.forEach((winningPrize, i) => {
        const prizePool = caseItem.prizes;
        const reelItems = [...Array(50)].flatMap(() => shuffle([...prizePool]));
        
        let winningIndex = reelItems.length - Math.floor(Math.random() * 10) - 5;
        reelItems[winningIndex] = winningPrize;

        newReels.push({
            id: i,
            items: reelItems,
            offset: 0,
            winningPrize: reelItems[winningIndex],
        });
    });

    setReels(newReels);

    // Use requestAnimationFrame to ensure the initial state is rendered before the transition starts
    requestAnimationFrame(() => {
        setReels(prevReels => prevReels.map((reel) => {
            const winningItem = reel.winningPrize;
            let winningIndex = reel.items.lastIndexOf(winningItem);

            if (winningIndex < reel.items.length - 20) {
                winningIndex = reel.items.length - Math.floor(Math.random() * 10) - 5;
                reel.items[winningIndex] = winningItem;
            }
            
            const jitter = (Math.random() - 0.5) * (REEL_ITEM_WIDTH * 0.6);
            const targetOffset = (winningIndex * REEL_ITEM_WIDTH) - (REEL_ITEM_WIDTH / 2) + jitter;
            return { ...reel, offset: targetOffset, winningPrize: reel.items[winningIndex] };
        }));
    });

    setTimeout(() => {
      setIsSpinning(false);
      const actualWonPrizes = newReels.map(reel => reel.winningPrize);
      setWonPrizes(actualWonPrizes);
      
      actualWonPrizes.forEach(prize => {
          if (!prize.description.includes('Stars')) {
            addInventoryItem({
                id: `${prize.id}-${Date.now()}-${Math.random()}`,
                name: prize.description,
                image: prize,
            });
          } else {
            const starAmount = parseInt(prize.description.replace(/[^0-9]/g, ''));
            if (!isNaN(starAmount)) {
                userProfile.stars += starAmount;
            }
          }
      });
      
      setForceRender(Math.random());
    }, REVEAL_DURATION_MS + 200);
  };

  const reset = () => {
    // For free case, we don't want to re-open the dialog automatically.
    // For paid cases, we can.
    if(caseItem.cost > 0) {
      setWonPrizes([]);
      setIsSpinning(false);
      setReels([]);
      setMultiplier(1);
    } else {
      setIsOpen(false);
      setWonPrizes([]);
      setIsSpinning(false);
      setReels([]);
      setMultiplier(1);
    }
  }

  const handleGoToInventory = () => {
    setIsOpen(false);
    reset();
    router.push('/inventory');
  }

  const renderInitialView = () => (
    <div className='flex flex-col h-full'>
      <DialogHeader className="p-4 border-b border-border">
        <DialogTitle className="text-lg font-semibold text-center">{t(caseItem.name)}</DialogTitle>
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
                <p className="text-muted-foreground mb-2">{t('How many to open?')}</p>
                <RadioGroup 
                    defaultValue="1" 
                    className="grid grid-cols-4 gap-2"
                    value={String(multiplier)}
                    onValueChange={(val) => setMultiplier(parseInt(val) as Multiplier)}
                >
                    {MULTIPLIERS.map(m => (
                        <div key={m}>
                            <RadioGroupItem value={String(m)} id={`m-${m}`} className="sr-only" />
                            <Label 
                                htmlFor={`m-${m}`} 
                                className={cn(
                                    "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground cursor-pointer",
                                    "transition-colors duration-300",
                                    "[&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary [&:has([data-state=checked])]:text-primary-foreground"
                                )}
                            >
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
            disabled={isSpinning || isDisabled}
          >
            {isSpinning ? <Loader2 className="w-6 h-6 animate-spin" /> : (
              <div className='flex items-center justify-center gap-2'>
                <span>{caseItem.cost > 0 ? t('Spin for {{totalCost}}', { totalCost: totalCost.toLocaleString() }) : (isDisabled ? t('Come back later') : t('Spin for Free'))}</span>
                {caseItem.cost > 0 && <Image src="https://i.ibb.co/fmx59f8/stars.png" alt="Stars" width={20} height={20} />}
              </div>
            )}
          </Button>
           <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-none">
              <AccordionTrigger className="w-full h-12 bg-card/50 hover:no-underline rounded-lg px-4 justify-center gap-2 text-muted-foreground">
                <Gift className="w-5 h-5" />
                <span>{t('Prizes Inside')}</span>
              </AccordionTrigger>
              <AccordionContent className="p-4 bg-background/80 rounded-b-lg">
                <ScrollArea className="h-48">
                    <div className="grid grid-cols-4 gap-2">
                    {caseItem.prizes.map(prize => (
                        <div key={prize.id} className="p-1 bg-card rounded-md aspect-square">
                            <PrizeDisplay prize={prize} showChance={true}/>
                        </div>
                    ))}
                    </div>
                </ScrollArea>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
      </DialogFooter>
    </div>
  );

  const renderSpinningView = () => (
    <div className="h-full flex flex-col items-center justify-center relative overflow-hidden bg-card/80 text-center p-6">
      <h2 className="text-3xl font-bold font-headline mb-4">{t('Opening {{multiplier}} case(s)...', { multiplier })}</h2>
      <ScrollArea className="w-full flex-grow">
          <div className='flex flex-col items-center gap-4 py-4'>
            {reels.map((reel) => (
              <div key={reel.id} className="relative w-full h-32 flex items-center justify-center overflow-hidden">
                {/* The Marker */}
                <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-0.5 h-36 bg-primary z-10 rounded-full" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-2 bg-primary z-10" style={{clipPath: 'polygon(50% 100%, 0 0, 100% 0)'}}/>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-2 bg-primary z-10" style={{clipPath: 'polygon(50% 0, 0 100%, 100% 100%)'}}/>
                
                {/* The Reel */}
                <div 
                  className="absolute left-1/2 h-full flex items-center transition-transform"
                  style={{ 
                      transform: `translateX(calc(-${reel.offset}px))`,
                      transitionDuration: `${REVEAL_DURATION_MS}ms`,
                      transitionTimingFunction: 'cubic-bezier(0.1, 0, 0.2, 1)'
                  }}
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
        <h2 className="text-3xl font-bold font-headline mb-4">{t('You Won!')}</h2>
        <ScrollArea className='w-full max-w-md flex-grow my-4'>
            <div className="grid grid-cols-3 gap-2 p-1">
                {wonPrizes.map((prize, index) => (
                    <div key={`${prize.id}-${index}`} className="aspect-square animate-won-glow">
                        <PrizeDisplay prize={prize} isWon={true} />
                    </div>
                ))}
            </div>
        </ScrollArea>
        <p className="text-muted-foreground mb-6">
            {t('Your new items have been added to your inventory.')}
        </p>
        <div className="flex flex-col gap-2 w-full max-w-sm">
            <Button onClick={handleGoToInventory}>
                <Gift className="mr-2 h-4 w-4" />
                {t('Go to Inventory')}
            </Button>
            <Button variant="outline" onClick={reset}>{t('Close')}</Button>
        </div>
    </div>
  )

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) reset(); setIsOpen(open); }}>
      <DialogTrigger asChild onClick={() => setIsOpen(true)} disabled={isDisabled}>
        {children}
      </DialogTrigger>
      <DialogContent className="w-full h-full max-h-full sm:max-w-full sm:h-full p-0 bg-transparent border-none flex flex-col">
        {wonPrizes.length === 0 ? (isSpinning ? renderSpinningView() : renderInitialView()) : renderWonView()}
      </DialogContent>
    </Dialog>
  );
}

declare global {
    interface Window {
        Telegram: any;
    }
}
