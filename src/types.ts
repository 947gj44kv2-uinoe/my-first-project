export interface Track {
  id: string;
  title: string;
  artist: string;
  genre: string;
  coverUrl: string;
  duration: string;
  isHighQuality: boolean;
  isDownloaded: boolean;
}

export interface Recommendation {
  artist: string;
  description: string;
  tags: string[];
}
