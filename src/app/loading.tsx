
'use client';

import { useEffect, useState } from 'react';

export default function Loading() {
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    // Sequence of animations
    const timers = [
      setTimeout(() => setAnimationStep(1), 100),      // Initial fade-in
      setTimeout(() => setAnimationStep(2), 1100),     // First fade-out
      setTimeout(() => setAnimationStep(3), 1600),     // First fade-in
      setTimeout(() => setAnimationStep(4), 2600),     // Second fade-out
      setTimeout(() => setAnimationStep(5), 3100),     // Final glow
    ];

    // Cleanup timers on component unmount
    return () => timers.forEach(clearTimeout);
  }, []);

  const getAnimationClass = () => {
    switch (animationStep) {
      case 1: return 'animate-fade-in-splash';
      case 2: return 'animate-fade-out-splash';
      case 3: return 'animate-fade-in-splash';
      case 4: return 'animate-fade-out-splash';
      case 5: return 'animate-glow-splash text-primary';
      default: return 'opacity-0';
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-background">
      <div className="relative flex flex-col items-center gap-4">
        <h1 className={`text-7xl font-bold tracking-widest transition-opacity duration-500 ${getAnimationClass()}`}>
          APEX
        </h1>
      </div>
    </div>
  );
}
