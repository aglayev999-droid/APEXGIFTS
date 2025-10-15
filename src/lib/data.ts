import placeholderData from './placeholder-images.json';
import type { ImagePlaceholder } from './types';

const images: ImagePlaceholder[] = placeholderData.placeholderImages;
const findImage = (id: string) => images.find(img => img.id === id)!;

export const userProfile = {
  name: 'nullrox',
  telegramId: '@nullrox',
  avatarUrl: findImage('user-avatar').imageUrl,
  stars: 1250,
};

export const cases = [
  { id: 'case-1', name: 'Common Case', cost: 180, image: findImage('case-180') },
  { id: 'case-2', name: 'Rare Case', cost: 300, image: findImage('case-300') },
  { id: 'case-3', name: 'Legendary Case', cost: 500, image: findImage('case-500') },
];

export const inventory = [
  { id: 'inv-1', name: 'Cyber Punk Ape', image: findImage('nft-1') },
  { id: 'inv-2', name: 'Galaxy Orb', image: findImage('nft-2') },
  { id: 'inv-3', name: 'Pixel Sword', image: findImage('nft-4') },
  { id: 'inv-4', name: 'Mystic Cat', image: findImage('nft-5') },
  { id: 'inv-5', name: 'Dragon Egg', image: findImage('nft-6') },
  { id: 'inv-6', name: 'Space Helmet', image: findImage('nft-7') },
];

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

export const leaderboard = [
  { rank: 1, user: 'CryptoKing', avatar: 'https://picsum.photos/seed/leader1/40/40', casesOpened: 128 },
  { rank: 2, user: 'NFTQueen', avatar: 'https://picsum.photos/seed/leader2/40/40', casesOpened: 112 },
  { rank: 3, user: 'nullrox', avatar: userProfile.avatarUrl, casesOpened: 98 },
  { rank: 4, user: 'DiamondHands', avatar: 'https://picsum.photos/seed/leader4/40/40', casesOpened: 85 },
  { rank: 5, user: 'TokenMaster', avatar: 'https://picsum.photos/seed/leader5/40/40', casesOpened: 76 },
  { rank: 6, user: 'SatoshiJr', avatar: 'https://picsum.photos/seed/leader6/40/40', casesOpened: 64 },
  { rank: 7, user: 'ChainSurfer', avatar: 'https://picsum.photos/seed/leader7/40/40', casesOpened: 51 },
];
