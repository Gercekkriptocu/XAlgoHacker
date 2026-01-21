
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

export type AiProvider = 'GEMINI' | 'OPENAI' | 'XAI';

export interface SavedPersona {
  id: string;
  name: string;
  handle: string; // The @handle or description to mimic
}

export interface HookTest {
  hook: string;
  reasoning: string;
}

export interface EnhancementTip {
  tip: string;
  impact: string; // e.g., "+15% Engagement"
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
  mlAnalysis?: {
    viralScore: number; // 0-100
    sentimentLabel: string; // Positive, Negative, Neutral
    enhancementTips: EnhancementTip[];
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

// --- AUDIENCE TYPES ---

export interface AudienceProfile {
  niche: string;
  primaryInterests: string[];
  contentStyle: ContentStyle;
  tonePreference: TonePreference;
  expertiseLevel: ExpertiseLevel;
  preferredFormat: PreferredFormat;
  confidence: 'low' | 'medium' | 'high';
  createdAt: string;
}

export type ContentStyle = 
  | 'educational'
  | 'entertaining'
  | 'controversial'
  | 'personal_story'
  | 'data_driven';

export type TonePreference = 
  | 'professional'
  | 'casual'
  | 'hype'
  | 'motivational'
  | 'analytical';

export type ExpertiseLevel = 'beginner' | 'intermediate' | 'expert';

export type PreferredFormat = 'threads' | 'short_tweets' | 'polls' | 'memes';

export interface Question {
  id: string;
  text: {
    EN: string;
    TR: string;
  };
  type: 'single_choice' | 'multiple_choice' | 'text_input';
  options?: QuestionOption[];
  placeholder?: {
    EN: string;
    TR: string;
  };
}

export interface QuestionOption {
  label: {
    EN: string;
    TR: string;
  };
  value: string;
  tags: string[];
  emoji?: string;
}

export interface Answer {
  questionId: string;
  value: string | string[];
  tags: string[];
}
