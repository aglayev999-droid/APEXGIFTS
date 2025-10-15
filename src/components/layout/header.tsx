
'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { userProfile as defaultUserProfile } from '@/lib/data';
import { useTonConnectUI, useTonWallet } from '@tonconnect/ui-react';
import { Button } from '../ui/button';
import { Wallet } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '../ui/skeleton';

type TelegramUser = {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
};

export default function Header() {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [stars, setStars] = useState(defaultUserProfile.stars);
  const [formattedStars, setFormattedStars] = useState(defaultUserProfile.stars.toString());
  const wallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();
  
  const updateStars = useCallback(() => {
    const currentStars = defaultUserProfile.stars;
    setStars(currentStars);
  }, []);

  useEffect(() => {
    // This effect runs only on the client.
    updateStars();
    // Format stars only on the client to prevent hydration mismatch
    setFormattedStars(stars.toLocaleString());

    if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      
      const tgUser = tg.initDataUnsafe?.user;

      if (tgUser) {
        setUser({
          id: tgUser.id,
          first_name: tgUser.first_name,
          last_name: tgUser.last_name,
          username: tgUser.username,
          photo_url: tgUser.photo_url
        });
      }
      setLoading(false);
    } else {
        // Not in telegram environment
        setLoading(false);
    }
    
    // Create an interval to check for balance changes
    const interval = setInterval(updateStars, 500); // Check every half a second
    
    // Clean up interval on component unmount
    return () => clearInterval(interval);

  }, [updateStars, stars]);


  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  }
  
  const displayName = user ? `${user.first_name} ${user.last_name || ''}`.trim() : 'Guest';
  const avatarUrl = user?.photo_url;
  const avatarFallback = displayName.charAt(0).toUpperCase();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {loading ? (
             <>
                <Skeleton className="h-9 w-9 rounded-full" />
                <Skeleton className="h-5 w-24" />
             </>
          ) : (
            <>
              <Avatar className="w-9 h-9 border-2 border-primary">
                {avatarUrl && <AvatarImage src={avatarUrl} alt={displayName} />}
                <AvatarFallback>{avatarFallback}</AvatarFallback>
              </Avatar>
              <span className="text-lg font-bold text-foreground">{displayName}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-card px-3 py-1.5 rounded-full border border-primary/30">
            <Image src="https://i.ibb.co/fmx59f8/stars.png" alt="Stars" width={20} height={20} />
            <span className="font-bold text-lg text-foreground">{formattedStars}</span>
          </div>
          {wallet ? (
             <Button
                size="sm"
                variant={'secondary'}
                className="border-primary/50 text-primary"
                onClick={() => tonConnectUI.openModal()}
              >
                <Wallet className="mr-2 h-4 w-4" />
                {formatAddress(wallet.account.address)}
              </Button>
          ) : (
            <Button
              size="sm"
              variant={'outline'}
              className="border-primary/50 text-primary"
              onClick={() => tonConnectUI.openModal()}
            >
              <Wallet className="mr-2 h-4 w-4" />
              {'Connect Wallet'}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
