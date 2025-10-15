'use client';

import { useEffect, useState } from 'react';
import { CaseOpeningModal } from './case-opening-modal';
import { cases } from '@/lib/data';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

// Returns the date string for the current day in UTC
const getTodayUTCString = () => {
  const now = new Date();
  return now.toISOString().split('T')[0];
};


// Calculate the target time for the next day at 00:00 UTC
const getNextFreeCaseTime = () => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setUTCHours(24, 0, 0, 0);
  return tomorrow.getTime();
};

export function FreeCaseTimer() {
  const [timeLeft, setTimeLeft] = useState('');
  const [canClaim, setCanClaim] = useState(false);
  
  const freeCase = cases.find(c => c.cost === 0);
  if (!freeCase) return null;

  const checkCanClaim = () => {
    const lastClaimedDate = localStorage.getItem('freeCaseLastClaimed');
    const today = getTodayUTCString();
    return lastClaimedDate !== today;
  }

  useEffect(() => {
    if (checkCanClaim()) {
      setCanClaim(true);
      setTimeLeft("Claim Now!");
      return;
    } else {
        setCanClaim(false);
    }

    const calculateTimeLeft = () => {
      const difference = getNextFreeCaseTime() - new Date().getTime();
      
      let timeLeftString = "Already Claimed";

      if (difference > 0) {
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        
        timeLeftString = 
          String(hours).padStart(2, '0') + ':' + 
          String(minutes).padStart(2, '0') + ':' + 
          String(seconds).padStart(2, '0');
      } else {
        // Time is up, user can claim now
        setCanClaim(true);
        timeLeftString = "Claim Now!";
      }
      
      return timeLeftString;
    };

    const interval = setInterval(() => {
        if (checkCanClaim()) {
            setCanClaim(true);
            setTimeLeft("Claim Now!");
            clearInterval(interval);
        } else {
            setTimeLeft(calculateTimeLeft());
        }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const onCaseOpened = () => {
    const today = getTodayUTCString();
    localStorage.setItem('freeCaseLastClaimed', today);
    setCanClaim(false);
    // Restart the timer effect
    const event = new Event('storage');
    window.dispatchEvent(event);
  };


  return (
      <CaseOpeningModal caseItem={freeCase} onCaseOpened={onCaseOpened} isDisabled={!canClaim}>
        <div 
          className={cn(
            "w-full h-10 rounded-lg flex items-center justify-center gap-2 text-md font-bold mt-2",
            canClaim 
              ? "bg-primary text-primary-foreground cursor-pointer transition-all duration-300 group-hover:bg-primary/90"
              : "bg-card text-muted-foreground border border-dashed border-border"
          )}
        >
          <span>{timeLeft}</span>
        </div>
      </CaseOpeningModal>
  );
}
