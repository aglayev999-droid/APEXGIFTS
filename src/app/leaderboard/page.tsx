
'use client';
import { getLeaderboard, type LeaderboardEntry } from '@/lib/data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { useTranslation } from '@/context/language-context';

export default function LeaderboardPage() {
    const { t } = useTranslation();
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        // This ensures the component has mounted on the client
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!isClient) return; // Don't run on server or before initial client render

        // Now that we're on the client, we can safely access localStorage
        const loadLeaderboard = () => {
            setLeaderboard(getLeaderboard());
        };

        loadLeaderboard();

        // Refresh data when window gets focus
        window.addEventListener('focus', loadLeaderboard);
        
        // Also listen for a custom event that we can dispatch after opening a case
        window.addEventListener('leaderboardUpdated', loadLeaderboard);

        return () => {
            window.removeEventListener('focus', loadLeaderboard);
            window.removeEventListener('leaderboardUpdated', loadLeaderboard);
        }
    }, [isClient]);

  if (!isClient) {
    // Render a loading state or nothing on the server to prevent hydration mismatch
    return null; 
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline tracking-tight text-primary">{t('Top Collectors')}</h1>
        <p className="text-muted-foreground mt-2">{t("See who's leading the pack.")}</p>
      </div>

      <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="text-yellow-400" />
            {t('Leaderboard')}
          </CardTitle>
        </CardHeader>
        <CardContent>
            {leaderboard.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-primary/20">
                <TableHead className="w-[50px]">{t('Rank')}</TableHead>
                <TableHead>{t('User')}</TableHead>
                <TableHead className="text-right">{t('Cases Opened')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboard.map((entry, index) => (
                <TableRow key={entry.user + entry.rank} className={index < 3 ? 'font-bold' : ''}>
                  <TableCell>
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted">
                      {index < 3 ? (
                        <Trophy
                          className={cn(
                            'h-5 w-5',
                            index === 0 && 'text-yellow-400',
                            index === 1 && 'text-slate-400',
                            index === 2 && 'text-amber-700'
                          )}
                        />
                      ) : (
                        entry.rank
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={entry.avatar} alt={entry.user} />
                        <AvatarFallback>{entry.user.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{entry.user}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-lg">{entry.casesOpened}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
           ) : (
            <div className="text-center py-10">
                <p className="text-muted-foreground">{t('The leaderboard is empty.')}</p>
                <p className="text-muted-foreground">{t('Open some cases to get on the board!')}</p>
            </div>
           )}
        </CardContent>
      </Card>
    </div>
  );
}
