export type Language = 'nl' | 'en';

export type AddressMode = 'subdomain' | 'domain';

export type CardTheme = 'linen' | 'terracotta' | 'olive' | 'noir';

export interface PhotoItem {
  id: string;
  url: string;
  caption: string;
  author: string;
  authorType: 'guest' | 'photographer';
  timestamp: string;
  likes: number;
  isOriginalQuality?: boolean;
}

export interface DemoAlbum {
  slug: string;
  name: string;
  date: string;
  location: string;
  coverImage: string;
  theme: string;
  guestCount: number;
  photoCount: number;
  photos: PhotoItem[];
}

export interface PricingPlan {
  id: 'free' | 'event' | 'event_plus';
  name: string;
  price: string;
  priceNumber: number;
  period: string;
  badge?: string;
  description: string;
  features: string[];
  highlight?: boolean;
}
