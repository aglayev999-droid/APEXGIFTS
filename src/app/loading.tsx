
'use client';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-background">
      <div className="relative flex flex-col items-center gap-4">
        <h1 className="text-7xl font-bold tracking-widest text-primary animate-splash-total">
          APEX
        </h1>
      </div>
    </div>
  );
}
