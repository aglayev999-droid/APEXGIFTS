export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

export type Case = {
  id: string;
  name: string;
  cost: number;
  image: ImagePlaceholder;
};
