
export interface StoryPart {
  id: string;
  type: 'ai' | 'user' | 'system';
  content: string;
  choices?: string[];
  imageUrl?: string;
  imageLoading?: boolean;
}

export type GameState = 'SETUP' | 'STORY' | 'LOADING' | 'ERROR';