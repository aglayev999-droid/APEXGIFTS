'use client';

import { useEffect, useState } from 'react';

// Calculate the target time for the next day at 00:00 UTC
const getNextFreeCaseTime = () => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setUTCHours(24, 0, 0, 0);
  return tomorrow.getTime();
};

export function FreeCaseTimer() {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = getNextFreeCaseTime() - new Date().getTime();
      
      let timeLeftString = "Claim Now!";

      if (difference > 0) {
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        
        timeLeftString = 
          String(hours).padStart(2, '0') + ':' + 
          String(minutes).padStart(2, '0') + ':' + 
          String(seconds).padStart(2, '0');
      }
      
      return timeLeftString;
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full bg-card text-muted-foreground h-10 rounded-lg flex items-center justify-center gap-2 text-md font-bold mt-2 border border-dashed border-border">
      <span>{timeLeft}</span>
    </div>
  );
}
