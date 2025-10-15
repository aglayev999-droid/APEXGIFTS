'use client';

import { useState, useEffect } from 'react';
import { userProfile as defaultUserProfile } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share2, Bot, PlusCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

type TelegramUser = {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
};

export default function ProfilePage() {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
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
        // Fallback for when not in Telegram environment
        setUser({
            id: 12345,
            first_name: defaultUserProfile.name,
            username: defaultUserProfile.telegramId.replace('@', ''),
            photo_url: defaultUserProfile.avatarUrl,
        })
        setLoading(false);
    }
  }, []);
  
  const handleDepositClick = () => {
    toast({
        title: 'Telegram Only Feature',
        description: 'Deposits can only be made within the Telegram app.',
        variant: 'destructive',
      });
  }

  const displayName = user ? `${user.first_name} ${user.last_name || ''}`.trim() : 'Guest';
  const displayUsername = user?.username ? `@${user.username}` : 'No Telegram ID';
  const avatarUrl = user?.photo_url || defaultUserProfile.avatarUrl;
  const avatarFallback = displayName.charAt(0).toUpperCase();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center text-center">
        {loading ? (
            <>
                <Skeleton className="w-24 h-24 rounded-full mb-4" />
                <Skeleton className="h-8 w-40 mb-2" />
                <Skeleton className="h-5 w-32" />
            </>
        ) : (
            <>
                <Avatar className="w-24 h-24 border-4 border-primary mb-4">
                  <AvatarImage src={avatarUrl} alt={displayName} />
                  <AvatarFallback>{avatarFallback}</AvatarFallback>
                </Avatar>
                <h1 className="text-3xl font-bold font-headline">{displayName}</h1>
                <p className="text-muted-foreground">{displayUsername}</p>
            </>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Invite Friends</CardTitle>
            <CardDescription>Get rewards for inviting your friends to play.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              <Share2 className="mr-2 h-4 w-4" />
              Share Invite Link
            </Button>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Deposit Stars</CardTitle>
            <CardDescription>Add more stars to your balance to open cases.</CardDescription>
          </CardHeader>
          <CardContent>
             <Button className="w-full" onClick={handleDepositClick}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Deposit
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4 bg-card/50 backdrop-blur-sm border-primary/20">
        <CardHeader>
            <CardTitle className="text-lg">Bot Connection</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
            <Bot className="h-8 w-8 text-primary" />
            <div>
                <p className="font-semibold">Connected to @ApexGiftBot</p>
                <p className="text-sm text-muted-foreground">Your gifts and notifications are handled by our Telegram bot.</p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Add this to your global types or a declarations file (e.g., globals.d.ts)
declare global {
  interface Window {
    Telegram: any;
  }
}
