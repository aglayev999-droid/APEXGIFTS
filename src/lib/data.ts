
import placeholderData from './placeholder-images.json';
import type { ImagePlaceholder, Prize, InventoryItem, LeaderboardEntry } from './types';

const images: ImagePlaceholder[] = placeholderData.placeholderImages;
const findImage = (id: string) => {
    const image = images.find(img => img.id === id);
    if (!image) {
        throw new Error(`Image with id "${id}" not found.`);
    }
    return image;
};

export const userProfile = {
  name: 'nullrox',
  telegramId: '@nullrox',
  avatarUrl: findImage('user-avatar').imageUrl,
  stars: 10000,
};

const freeCasePrizes: Prize[] = [
    { ...findImage('stars-5'), chance: 50 },
    { ...findImage('stars-10'), chance: 30 },
    { ...findImage('stars-15'), chance: 15 },
    { ...findImage('stars-20'), chance: 5 },
];

const labubuCasePrizes: Prize[] = [
    { ...findImage('stars-100'), chance: 40 },
    { ...findImage('desk-calendar'), chance: 20 },
    { ...findImage('clover-pin'), chance: 15 },
    { ...findImage('bow-tie'), chance: 10 },
    { ...findImage('light-sword'), chance: 8 },
    { ...findImage('skull-flower'), chance: 5 },
    { ...findImage('voodoo-doll'), chance: 2 },
];

const apexCasePrizes: Prize[] = [
    { ...findImage('stars-50'), chance: 40 },
    { ...findImage('stars-100'), chance: 20 },
    { ...findImage('desk-calendar'), chance: 12 },
    { ...findImage('clover-pin'), chance: 10 },
    { ...findImage('bow-tie'), chance: 8 },
    { ...findImage('light-sword'), chance: 5 },
    { ...findImage('love-potion'), chance: 3 },
    { ...findImage('cupid-charm'), chance: 2 },
];

const floorCasePrizes: Prize[] = [
    { ...findImage('stars-50'), chance: 60 },
    { ...findImage('stars-100'), chance: 25 },
    { ...findImage('clover-pin'), chance: 8 },
    { ...findImage('bow-tie'), chance: 5 },
    { ...findImage('light-sword'), chance: 2 },
];

export const cases = [
  { id: 'case-1', name: 'Free Box', cost: 0, image: findImage('case-free'), prizes: freeCasePrizes },
  { id: 'case-2', name: 'Floor Case', cost: 180, image: findImage('case-180'), prizes: floorCasePrizes },
  { id: 'case-3', name: 'Labubu Case', cost: 300, image: findImage('case-300'), prizes: apexCasePrizes },
  { id: 'case-4', name: 'Apex Case', cost: 500, image: findImage('case-500'), prizes: labubuCasePrizes },
];


export let inventory: InventoryItem[] = [];

export const addInventoryItem = (item: InventoryItem) => {
    inventory.unshift(item);
};

export const removeInventoryItem = (itemId: string) => {
    inventory = inventory.filter(item => item.id !== itemId);
};

export const allPrizes = [...new Set([...freeCasePrizes, ...floorCasePrizes, ...labubuCasePrizes, ...apexCasePrizes])];

// --- Leaderboard Logic ---
const LEADERBOARD_KEY = 'apex-gift-bot-leaderboard';

// Function to get leaderboard from localStorage
export const getLeaderboard = (): LeaderboardEntry[] => {
    if (typeof window === 'undefined') {
        return [];
    }
    const storedLeaderboard = localStorage.getItem(LEADERBOARD_KEY);
    return storedLeaderboard ? JSON.parse(storedLeaderboard) : [];
};

// Function to save leaderboard to localStorage
const saveLeaderboard = (leaderboard: LeaderboardEntry[]) => {
    if (typeof window === 'undefined') {
        return;
    }
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(leaderboard));
};

export const updateLeaderboard = (user: { name: string; avatar: string }, casesOpened: number) => {
  const leaderboard = getLeaderboard();
  const existingUserIndex = leaderboard.findIndex(entry => entry.user === user.name);

  if (existingUserIndex > -1) {
    leaderboard[existingUserIndex].casesOpened += casesOpened;
  } else {
    leaderboard.push({
      rank: 0,
      user: user.name,
      avatar: user.avatar,
      casesOpened: casesOpened,
    });
  }

  // Sort by cases opened (desc)
  leaderboard.sort((a, b) => b.casesOpened - a.casesOpened);

  // Update ranks
  leaderboard.forEach((entry, index) => {
    entry.rank = index + 1;
  });

  saveLeaderboard(leaderboard);

  // Dispatch a custom event to notify other components (like the leaderboard page)
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('leaderboardUpdated'));
  }
};
