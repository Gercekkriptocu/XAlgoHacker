
import { GoogleGenAI, Type } from "@google/genai";
import { OptimizedTweet, TweetType, Language, Tone, AudienceProfile } from '../types';
import { AudienceService } from './audienceService';

const getSystemInstruction = (
  language: Language, 
  tone: Tone, 
  isThreadMode: boolean, 
  accountTier: string, 
  targetProfile?: string, 
  isAuditOnly?: boolean,
  audienceProfile?: AudienceProfile
) => {
  let audienceContext = '';
  
  if (audienceProfile) {
    const rules = AudienceService.getOptimizationRules(audienceProfile);
    audienceContext = `
**TARGET AUDIENCE CALIBRATION (CRITICAL OVERRIDE):**
- **Niche Context:** ${audienceProfile.niche.replace(/_/g, ' ').toUpperCase()}
- **Audience Level:** ${audienceProfile.expertiseLevel.toUpperCase()} (Adjust vocabulary complexity accordingly)
- **Primary Interests:** ${audienceProfile.primaryInterests.join(', ')}
- **Content Style Preference:** ${audienceProfile.contentStyle.toUpperCase()}
- **Mandatory Niche Keywords:** ${rules.keywords.join(', ')}
- **Words to AVOID (Anti-patterns):** ${rules.avoid.join(', ')}
- **Optimal Character Count:** ~${rules.optimal_length} chars
- **Preferred Hook Style:** ${rules.hooks[0]} OR ${rules.hooks[1]}
    `;
  }

  return `
You are the X_ALGOHACKER.
Mission: Perform "Algorithm Penetration" based on Heavy Ranker weights AND simulate a Random Forest ML Model trained on 1M+ viral tweets.

**CONTEXT:**
- Language: ${language === 'TR' ? 'Turkish (TR)' : 'English (EN)'}
- Tone: ${tone}
${targetProfile ? `- STYLE_HACK_ACTIVE: Mimic the EXACT writing style, tone, emoji usage, and sentence structure of ${targetProfile}. If ${targetProfile} writes in a specific language or uses specific slang, adopt it perfectly.` : '- STYLE_HACK_INACTIVE: Use general algorithm-optimized professional/viral tone.'}
- Format: ${isThreadMode ? 'THREAD_CHAIN (3 units minimum)' : 'SINGLE_UNIT (MAX 280 characters)'}
- Tier: ${accountTier}
- Mode: ${isAuditOnly ? 'AUDIT_ONLY (Analyze Input Only)' : 'GENERATION_MODE (Analyze + Optimize)'}

${audienceContext}

**STRICT THREAD RULES:**
- IF isThreadMode is FALSE: You MUST NOT generate threads. The 'thread' property in the JSON MUST be an empty array []. You MUST NOT use the 'VALUE_THREAD' type.
- IF isThreadMode is TRUE: You MUST generate a 'thread' array with at least 2 additional units. One of your 3 variations SHOULD be 'VALUE_THREAD'.

**ML MODEL SIMULATION (RandomForestClassifier):**
Act as a Python script analyzing features: ['has_numbers', 'has_emoji', 'word_count', 'sentiment_score', 'has_media', 'question_marks', 'capital_ratio'].
- Calculate a 'viralScore' (0-100) based on these features.
- Provide 'enhancementTips': specific actions to increase the score based on feature weights (e.g., "Add 1 emoji -> +12% lift", "Use a number -> +8% lift").

**CORE TASK:**
${isAuditOnly 
  ? '1. ANALYZE the input tweet strictly. \n2. Return an array containing EXACTLY 1 object of type "ORIGINAL". \n3. Provide detailed ML Analysis, Viral Score, and suggestions. \n4. DO NOT generate variations.' 
  : '1. Generate 3 HACKED variations + 1 ORIGINAL analysis.\n2. For each variation, run the ML Model Simulation.\n3. Provide "Global Temporal Injection": Recommend posting time and day including a "Geographic Context".'}

**ALGORITHM CONSTRAINTS BY TIER:**
- If Tier is 'NEW': Focus on niche hashtags (max 2) and keywords for cold-start discovery.
- If Tier is 'ACTIVE': Focus on engagement triggers (questions, high-value summaries).
- If Tier is 'VERIFIED': Zero hashtags. Focus heavily on P(Reply) to stay in "For You" feeds.
- If Tier is 'WHALE': Content should be "Pattern Interrupt" (short, punchy, extremely high-authority).

**FORMATTING:**
- Predicted metrics format: "Label (0.XX)" in ${language === 'TR' ? 'Turkish' : 'English'}.
- Alternative Hooks: Array of 5 items with 'hook' and 'reasoning'.
`;
};

export const generateOptimizedTweets = async (
  input: string,
  language: Language,
  tone: Tone,
  isThreadMode: boolean,
  accountTier: string,
  targetProfile?: string,
  isAuditOnly: boolean = false,
  audienceProfile?: AudienceProfile,
  apiKey?: string // Added optional API key parameter
): Promise<OptimizedTweet[]> => {
  
  // Use provided key OR fallback to env var
  const keyToUse = apiKey || process.env.API_KEY;

  if (!keyToUse) {
    throw new Error("API Key is missing. Please provide it in settings or environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey: keyToUse });

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Payload for Optimization: "${input}". ${targetProfile ? `Mimic Profile Handle: ${targetProfile}` : ""}`,
    config: {
      systemInstruction: getSystemInstruction(language, tone, isThreadMode, accountTier, targetProfile, isAuditOnly, audienceProfile),
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            content: { type: Type.STRING },
            thread: { type: Type.ARRAY, items: { type: Type.STRING } },
            imagePrompt: { type: Type.STRING },
            type: { type: Type.STRING, enum: [TweetType.ORIGINAL, TweetType.VIRAL_HOOK, TweetType.ENGAGEMENT_BAIT, TweetType.VALUE_THREAD] },
            score: { type: Type.NUMBER },
            explanation: { type: Type.STRING },
            alternativeHooks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  hook: { type: Type.STRING },
                  reasoning: { type: Type.STRING }
                },
                required: ["hook", "reasoning"]
              }
            },
            postingStrategy: {
              type: Type.OBJECT,
              properties: {
                bestTime: { type: Type.STRING },
                bestDay: { type: Type.STRING },
                geoContext: { type: Type.STRING },
                reasoning: { type: Type.STRING }
              }
            },
            mlAnalysis: {
              type: Type.OBJECT,
              properties: {
                viralScore: { type: Type.NUMBER, description: "0 to 100 probability based on ML model" },
                sentimentLabel: { type: Type.STRING },
                enhancementTips: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      tip: { type: Type.STRING },
                      impact: { type: Type.STRING }
                    }
                  }
                }
              },
              required: ["viralScore", "enhancementTips", "sentimentLabel"]
            },
            predictedMetrics: {
              type: Type.OBJECT,
              properties: {
                pLike: { type: Type.STRING },
                pReply: { type: Type.STRING },
                pRepost: { type: Type.STRING },
                pDwell: { type: Type.STRING }
              }
            }
          },
          required: ["content", "type", "score", "explanation", "predictedMetrics", "thread", "mlAnalysis"]
        }
      }
    }
  });

  try {
    const results = JSON.parse(response.text || "[]") as OptimizedTweet[];
    if (!isThreadMode) {
      return results.map(t => ({ ...t, thread: [] }));
    }
    return results;
  } catch (e) {
    console.error("Pipeline failure:", e);
    return [];
  }
};
