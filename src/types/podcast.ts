export interface Chapter {
  time: number; // in seconds
  title: string;
}

export interface TranscriptLine {
  time: number; // in seconds
  speaker: string;
  text: string;
}

export interface Episode {
  id: string;
  podcastId: string;
  podcastTitle: string;
  podcastCover: string;
  title: string;
  description: string;
  audioUrl: string;
  duration: number; // in seconds
  publishedAt: string;
  chapters?: Chapter[];
  transcript?: TranscriptLine[];
  isSaved?: boolean;
  playbackProgress?: number; // seconds listened
  isCompleted?: boolean;
}

export interface Podcast {
  id: string;
  title: string;
  publisher: string;
  description: string;
  coverUrl: string;
  categories: string[];
  rssUrl?: string;
  websiteUrl?: string;
  isSubscribed?: boolean;
  rating: number;
  totalEpisodes: number;
  episodes: Episode[];
  isCustom?: boolean;
}

export interface Bookmark {
  id: string;
  episodeId: string;
  episodeTitle: string;
  podcastTitle: string;
  podcastCover: string;
  timestamp: number;
  note: string;
  createdAt: string;
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  episodeIds: string[];
  createdAt: string;
}
