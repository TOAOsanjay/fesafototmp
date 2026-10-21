export type Role = 'guest' | 'organiser' | 'photographer' | 'venue';

export type Language = 'nl' | 'en';

export type ThemeId = 'terracotta' | 'olive' | 'midnight' | 'berry' | 'amber';

export interface ThemePreset {
  id: ThemeId;
  name: string;
  nameEn: string;
  accent: string;
  accentSoft: string;
  description: string;
}

export type ReviewStatus = 'geaccepteerd' | 'in_beoordeling' | 'verborgen';

export interface MediaItem {
  id: string;
  type: 'photo' | 'video';
  url: string;
  poster?: string;
  videoDuration?: string;
  caption: string;
  author: string;
  timestamp: string;
  likes: number;
  isNew?: boolean;
  status: ReviewStatus;
  isGuestOwner?: boolean;
}

export interface GuestbookEntry {
  id: string;
  author: string;
  type: 'text' | 'voice';
  content: string;
  timestamp: string;
  audioDuration?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'assistant' | 'user';
  text: string;
  timestamp: string;
}

export interface UploadFileItem {
  id: string;
  name: string;
  size: number;
  type: 'photo' | 'video';
  thumbnailUrl: string;
  progress: number;
  speed: string;
  status: 'uploading' | 'processing' | 'done';
}
