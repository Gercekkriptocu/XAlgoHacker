
export enum TweetType {
  ORIGINAL = 'ORIGINAL',
  VIRAL_HOOK = 'VIRAL_HOOK',
  ENGAGEMENT_BAIT = 'ENGAGEMENT_BAIT',
  VALUE_THREAD = 'VALUE_THREAD'
}

export enum Tone {
  DEFAULT = 'DEFAULT',
  FOMO_HYPE = 'FOMO_HYPE',
  FUD_ALERT = 'FUD_ALERT',
  GURU_WISDOM = 'GURU_WISDOM',
  SHITPOST_MEME = 'SHITPOST_MEME',
  OFFICIAL_NEWS = 'OFFICIAL_NEWS'
}

export interface HookTest {
  hook: string;
  reasoning: string;
}

export interface OptimizedTweet {
  content: string;
  thread?: string[];
  imagePrompt?: string;
  type: TweetType;
  score: number;
  explanation: string;
  alternativeHooks?: HookTest[];
  postingStrategy?: {
    bestTime: string;
    bestDay: string;
    geoContext: string;
    reasoning: string;
  };
  predictedMetrics: {
    pLike: string;
    pReply: string;
    pRepost: string;
    pDwell: string;
  };
}

export interface LogEntry {
  id: string;
  message: string;
  timestamp: string;
}

export interface OperationLog {
  id: string;
  timestamp: string;
  inputSnippet: string;
  results: OptimizedTweet[];
  language: Language;
}

export enum AppState {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}

export type Language = 'EN' | 'TR';
