'use client';

import { ApexLogo } from '@/components/icons/apex-logo';

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-background">
      <div className="relative flex flex-col items-center gap-4">
        <ApexLogo className="h-16 w-16 animate-pulse-logo text-primary" />
        <p className="text-muted-foreground">Yuklanmoqda...</p>
      </div>
    </div>
  );
}
