import placeholderData from './placeholder-images.json';
import type { ImagePlaceholder } from './types';

const images: ImagePlaceholder[] = placeholderData.placeholderImages;
const findImage = (id: string) => images.find(img => img.id === id)!;

export const userProfile = {
  name: 'nullrox',
  telegramId: '@nullrox',
  avatarUrl: findImage('user-avatar').imageUrl,
  stars: 0,
};

export const cases = [
  { id: 'case-1', name: 'Free Box', cost: 0, image: findImage('case-free') },
  { id: 'case-2', name: 'Floor Case', cost: 180, image: findImage('case-180') },
  { id: 'case-3', name: 'Labubu Case', cost: 300, image: findImage('case-300') },
  { id: 'case-4', name: 'Apex Case', cost: 500, image: findImage('case-500') },
];

export const inventory: { id: string; name: string; image: ImagePlaceholder }[] = [];

export const allPrizes = [
  findImage('nft-1'),
  findImage('nft-2'),
  findImage('nft-3'),
  findImage('nft-4'),
  findImage('nft-5'),
  findImage('nft-6'),
  findImage('nft-7'),
  findImage('nft-8'),
  findImage('nft-9'),
  findImage('nft-10'),
];

export const leaderboard: { rank: number; user: string; avatar: string; casesOpened: number }[] = [];
