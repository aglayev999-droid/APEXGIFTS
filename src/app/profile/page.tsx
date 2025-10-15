import Image from 'next/image';
import { userProfile } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share2, PlusCircle, Bot } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center text-center">
        <Avatar className="w-24 h-24 border-4 border-primary mb-4">
          <AvatarImage src={userProfile.avatarUrl} alt={userProfile.name} />
          <AvatarFallback>{userProfile.name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <h1 className="text-3xl font-bold font-headline">{userProfile.name}</h1>
        <p className="text-muted-foreground">{userProfile.telegramId}</p>
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
            <Button className="w-full">
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
