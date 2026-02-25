export type Platform = 'tiktok' | 'instagram' | 'facebook' | 'x';
export type PostingStatus = 'pending' | 'processing' | 'posted' | 'failed' | 'skipped';

export interface Video {
  id: string;
  youtubeId: string;
  title: string;
  description: string;
  tags?: string;
  thumbnailUrl: string;
  publishedAt: string;
  videoType: 'video' | 'short';
  customTitle?: string;
  customDescription?: string;
  customTags?: string;
  status: Record<Platform, PostingStatus>;
  platformUrls: Partial<Record<Platform, string>>;
  platformCaptions: Partial<Record<Platform, string>>;
}

export interface AutomationSettings {
  isEnabled: boolean;
  postIntervalMinutes: number;
  maxPostsPerDay: number;
  includeOldVideos: boolean;
  includeShorts: boolean;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl?: string;
}
