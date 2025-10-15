'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share2, Bot, Globe } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { DepositStars } from '@/components/deposit-stars';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useTranslation } from '@/context/language-context';


type TelegramUser = {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
};

export default function ProfilePage() {
  const { language, setLanguage, t } = useTranslation();
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
        setUser(null);
        setLoading(false);
    }
  }, []);
  
  const handleShareClick = () => {
    if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        const shareUrl = `https://t.me/share/url?url=https://t.me/your_bot_username&text=${encodeURIComponent(t('Check out this cool bot!'))}`;
        tg.openTelegramLink(shareUrl);
    } else {
        toast({
            title: t('Telegram Only Feature'),
            description: t('Sharing is only available within the Telegram app.'),
            variant: 'destructive',
        });
    }
  }

  const displayName = user ? `${user.first_name} ${user.last_name || ''}`.trim() : t('Guest');
  const displayUsername = user?.username ? `@${user.username}` : t('No Telegram ID');
  const avatarUrl = user?.photo_url;
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
                  {avatarUrl && <AvatarImage src={avatarUrl} alt={displayName} />}
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
            <CardTitle className="text-lg">{t('Invite Friends')}</CardTitle>
            <CardDescription>{t('Get rewards for inviting your friends to play.')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={handleShareClick}>
              <Share2 className="mr-2 h-4 w-4" />
              {t('Share Invite Link')}
            </Button>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">{t('Deposit Stars')}</CardTitle>
            <CardDescription>{t('Add more stars to your balance to open cases.')}</CardDescription>
          </CardHeader>
          <CardContent>
             <DepositStars />
          </CardContent>
        </Card>
      </div>

       <Card className="mt-4 bg-card/50 backdrop-blur-sm border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
                <Globe />
                {t('Language')}
            </CardTitle>
            <CardDescription>{t('Choose your preferred language.')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={language} onValueChange={(value) => setLanguage(value as 'en' | 'ru' | 'uz')}>
                <SelectTrigger>
                    <SelectValue placeholder={t('Select a language')} />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="en">
                        <div className='flex items-center gap-2'>
                           <span>🇺🇸</span> {t('English')}
                        </div>
                    </SelectItem>
                    <SelectItem value="ru">
                        <div className='flex items-center gap-2'>
                            <span>🇷🇺</span> {t('Russian')}
                        </div>
                    </SelectItem>
                    <SelectItem value="uz">
                       <div className='flex items-center gap-2'>
                            <span>🇺🇿</span> {t('Uzbek')}
                       </div>
                    </SelectItem>
                </SelectContent>
            </Select>
          </CardContent>
        </Card>

      <Card className="mt-4 bg-card/50 backdrop-blur-sm border-primary/20">
        <CardHeader>
            <CardTitle className="text-lg">{t('Bot Connection')}</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
            <Bot className="h-8 w-8 text-primary" />
            <div>
                <p className="font-semibold">{t('Connected to @ApexGiftBot')}</p>
                <p className="text-sm text-muted-foreground">{t('Your gifts and notifications are handled by our Telegram bot.')}</p>
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
