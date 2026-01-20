export enum TweetType {
  ORIGINAL = 'ORIGINAL',
  VIRAL_HOOK = 'VIRAL_HOOK',
  ENGAGEMENT_BAIT = 'ENGAGEMENT_BAIT',
  VALUE_THREAD = 'VALUE_THREAD'
}

export interface OptimizedTweet {
  content: string;
  type: TweetType;
  score: number;
  explanation: string;
  postingStrategy?: {
    bestTime: string;
    bestDay: string;
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

export enum AppState {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}

export type Language = 'EN' | 'TR';