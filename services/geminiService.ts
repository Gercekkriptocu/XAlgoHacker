
import { GoogleGenAI, Type } from "@google/genai";
import { OptimizedTweet, TweetType, Language, Tone } from '../types';

const getSystemInstruction = (language: Language, tone: Tone, isThreadMode: boolean, accountTier: string, targetProfile?: string) => `
You are the X_ALGOHACKER.
Mission: Perform "Algorithm Penetration" based on Heavy Ranker weights.

**CONTEXT:**
- Language: ${language === 'TR' ? 'Turkish (TR)' : 'English (EN)'}
- Tone: ${tone}
${targetProfile ? `- STYLE_HACK_ACTIVE: Mimic the EXACT writing style, tone, emoji usage, and sentence structure of ${targetProfile}. If ${targetProfile} writes in a specific language or uses specific slang, adopt it perfectly.` : '- STYLE_HACK_INACTIVE: Use general algorithm-optimized professional/viral tone.'}
- Format: ${isThreadMode ? 'THREAD_CHAIN (3 units minimum)' : 'SINGLE_UNIT (MAX 280 characters)'}
- Tier: ${accountTier}

**STRICT THREAD RULES:**
- IF isThreadMode is FALSE: You MUST NOT generate threads. The 'thread' property in the JSON MUST be an empty array []. You MUST NOT use the 'VALUE_THREAD' type.
- IF isThreadMode is TRUE: You MUST generate a 'thread' array with at least 2 additional units. One of your 3 variations SHOULD be 'VALUE_THREAD'.

**CORE TASK:**
1. Generate 3 HACKED variations + 1 ORIGINAL analysis.
2. For each HACKED variation, generate EXACTLY 5 "Alternative Hooks" (opening lines) that use different psychological triggers (FOMO, Authority, Mystery, etc.).
3. Provide "Global Temporal Injection": Recommend posting time and day including a "Geographic Context" (e.g., "New York (EST)" or "Istanbul (TRT)").

**ALGORITHM CONSTRAINTS BY TIER:**
- If Tier is 'NEW': Focus on niche hashtags (max 2) and keywords for cold-start discovery.
- If Tier is 'ACTIVE': Focus on engagement triggers (questions, high-value summaries).
- If Tier is 'VERIFIED': Zero hashtags. Focus heavily on P(Reply) to stay in "For You" feeds.
- If Tier is 'WHALE': Content should be "Pattern Interrupt" (short, punchy, extremely high-authority).

**FORMATTING:**
- Predicted metrics format: "Label (0.XX)" in ${language === 'TR' ? 'Turkish' : 'English'}.
- Alternative Hooks: Array of 5 items with 'hook' and 'reasoning'.
`;

export const generateOptimizedTweets = async (
  input: string,
  language: Language,
  tone: Tone,
  isThreadMode: boolean,
  accountTier: string,
  targetProfile?: string
): Promise<OptimizedTweet[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Payload for Optimization: "${input}". ${targetProfile ? `Mimic Profile Handle: ${targetProfile}` : ""}`,
    config: {
      systemInstruction: getSystemInstruction(language, tone, isThreadMode, accountTier, targetProfile),
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
          required: ["content", "type", "score", "explanation", "predictedMetrics", "thread"]
        }
      }
    }
  });

  try {
    const results = JSON.parse(response.text || "[]") as OptimizedTweet[];
    // Final safeguard: if thread mode is off, clear any threads accidentally generated
    if (!isThreadMode) {
      return results.map(t => ({ ...t, thread: [] }));
    }
    return results;
  } catch (e) {
    console.error("Pipeline failure:", e);
    return [];
  }
};
