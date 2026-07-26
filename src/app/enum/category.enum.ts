export enum CategorySlug {
  RINGS = 'rings',
  NECKLACES = 'necklaces',
  BRACELETS = 'bracelets',
  CHAINS = 'chains',
  EARRINGS = 'earrings',
}

export const CATEGORIES = [
  { id: '1', name: 'Rings',     slug: CategorySlug.RINGS,     image: 'assets/images/categories/rings.jpg',     description: 'Timeless symbols of elegance' },
  { id: '2', name: 'Necklaces', slug: CategorySlug.NECKLACES, image: 'assets/images/categories/necklaces.jpg', description: 'Grace that adorns the neckline' },
  { id: '3', name: 'Bracelets', slug: CategorySlug.BRACELETS, image: 'assets/images/categories/bracelets.jpg', description: 'Delicate accents for every wrist' },
  { id: '4', name: 'Chains',    slug: CategorySlug.CHAINS,    image: 'assets/images/categories/chains.jpg',    description: 'Crafted links of pure luxury' },
  { id: '5', name: 'Earrings',  slug: CategorySlug.EARRINGS,  image: 'assets/images/categories/earrings.jpg',  description: 'A whisper of gold at every turn' },
];
