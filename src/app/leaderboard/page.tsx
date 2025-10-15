'use client';
import { leaderboard } from '@/lib/data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

export default function LeaderboardPage() {
    const [_, setForceRender] = useState(0);

    // This effect will re-run when the page is focused, providing a simple way to refresh data
    useEffect(() => {
        const handleFocus = () => {
            setForceRender(Math.random());
        };
        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline tracking-tight text-primary">Top Collectors</h1>
        <p className="text-muted-foreground mt-2">See who's leading the pack.</p>
      </div>

      <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="text-yellow-400" />
            Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
            {leaderboard.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-primary/20">
                <TableHead className="w-[50px]">Rank</TableHead>
                <TableHead>User</TableHead>
                <TableHead className="text-right">Cases Opened</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboard.map((entry, index) => (
                <TableRow key={entry.rank} className={index < 3 ? 'font-bold' : ''}>
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
                <p className="text-muted-foreground">The leaderboard is empty.</p>
                <p className="text-muted-foreground">Open some cases to get on the board!</p>
            </div>
           )}
        </CardContent>
      </Card>
    </div>
  );
}
