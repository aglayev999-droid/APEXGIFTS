
import placeholderData from './placeholder-images.json';
import type { ImagePlaceholder, Prize, InventoryItem } from './types';

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
    inventory.push(item);
};

export const removeInventoryItem = (itemId: string) => {
    inventory = inventory.filter(item => item.id !== itemId);
};

export const allPrizes = [...new Set([...freeCasePrizes, ...floorCasePrizes, ...labubuCasePrizes, ...apexCasePrizes])];

export const leaderboard: { rank: number; user: string; avatar: string; casesOpened: number }[] = [];
