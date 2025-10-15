export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
  price?: number;
};

export type Case = {
  id: string;
  name: string;
  cost: number;
  image: ImagePlaceholder;
  prizes: ImagePlaceholder[];
};
