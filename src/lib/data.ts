import placeholderData from './placeholder-images.json';
import type { ImagePlaceholder } from './types';

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
  stars: 0,
};

const freeCasePrizes = [
    findImage('stars-5'),
    findImage('stars-10'),
    findImage('stars-15'),
    findImage('stars-20'),
];

const floorCasePrizes = [
    findImage('stars-50'),
    findImage('stars-100'),
    findImage('clover-pin'),
    findImage('bow-tie'),
    findImage('light-sword'),
];

const labubuCasePrizes = [
    findImage('stars-100'),
    findImage('desk-calendar'),
    findImage('clover-pin'),
    findImage('bow-tie'),
    findImage('light-sword'),
    findImage('skull-flower'),
    findImage('voodoo-doll'),
];

const apexCasePrizes = [
    findImage('stars-50'),
    findImage('stars-100'),
    findImage('desk-calendar'),
    findImage('clover-pin'),
    findImage('bow-tie'),
    findImage('light-sword'),
    findImage('love-potion'),
    findImage('cupid-charm'),
];


export const cases = [
  { id: 'case-1', name: 'Free Box', cost: 0, image: findImage('case-free'), prizes: freeCasePrizes },
  { id: 'case-2', name: 'Floor Case', cost: 180, image: findImage('case-180'), prizes: floorCasePrizes },
  { id: 'case-3', name: 'Labubu Case', cost: 300, image: findImage('case-300'), prizes: apexCasePrizes },
  { id: 'case-4', name: 'Apex Case', cost: 500, image: findImage('case-500'), prizes: labubuCasePrizes },
];

export const inventory: { id: string; name: string; image: ImagePlaceholder }[] = [];

export const allPrizes = [...new Set([...freeCasePrizes, ...floorCasePrizes, ...labubuCasePrizes, ...apexCasePrizes])];

export const leaderboard: { rank: number; user: string; avatar: string; casesOpened: number }[] = [];
