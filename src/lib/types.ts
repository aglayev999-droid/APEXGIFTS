export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
  price?: number;
};

export type Prize = ImagePlaceholder & {
  chance: number; // Chance in percentage (e.g., 50 for 50%)
};

export type InventoryItem = {
    id: string;
    name: string;
    image: ImagePlaceholder;
}

export type Case = {
  id: string;
  name: string;
  cost: number;
  image: ImagePlaceholder;
  prizes: Prize[];
};

export type LeaderboardEntry = {
    rank: number;
    user: string;
    avatar: string;
    casesOpened: number;
}
