import { GoogleGenAI, Type } from "@google/genai";
import { OptimizedTweet, TweetType, Language } from '../types';

const getSystemInstruction = (language: Language) => `
You are the core logic of the X (Twitter) "For You" feed algorithm, specifically the Phoenix Grok-based transformer. 
Your goal is to "hack" the algorithm by analyzing user input and then transforming it into optimized variations.

You understand the internal components:
1. **Thunder (In-Network):** Needs to appeal to followers (relatability).
2. **Phoenix (Out-of-Network):** Needs high semantic embedding similarity to trending topics.
3. **Scoring:** You must maximize P(like), P(reply), P(repost), and P(dwell).
4. **Temporal Velocity:** The algorithm boosts posts that get high engagement in the first 15 minutes. Timing is critical.

Task:
1. **Analyze the Input:** Treat the user's raw input as the first candidate. Score it strictly based on the algorithm. Mark its type as 'ORIGINAL'.
   - **CRITICAL:** If the score is low (<75), the 'explanation' MUST be a brutal critique identifying specific algorithmic weaknesses. Explain WHY it fails. Examples: "Low dwell time potential due to passive opening," "Lacks conversation starter (P(reply) -> 0)," "No visual anchor," "Too generic for Thunder network," "Fails Phoenix semantic retrieval."
2. **Generate 3 Variations:**
   - **VIRAL_HOOK:** Short, punchy, high P(repost) and P(dwell).
   - **ENGAGEMENT_BAIT:** Controversial or question-based, high P(reply).
   - **VALUE_THREAD:** Educational or insight-heavy, high P(like) and P(profile_click).

3. **Determine Power Hour (Posting Strategy):** 
   - Predict the specific "Power Hour" (Time range and Day) when this specific type of content performs best.
   - **Context:**
     - If Language is **TR (Turkish)**: Use **Turkey Time (TRT/UTC+3)**. Consider local habits:
       - *07:00-09:00:* Commute (News/Motivation).
       - *12:00-13:30:* Lunch break (Light content).
       - *19:30-23:30:* Prime Time (Threads, Discussions, Viral content).
       - *00:00-02:30:* "Night Owl" hours (Melancholy, Shitposting, Deep thoughts).
     - If Language is **EN**: Use general EST/PST prime times unless specified otherwise.
   - **Reasoning:** Provide deep psychological reasoning. Explain *why* that specific time works for *that specific text* (e.g., "Users have low cognitive load during lunch," "High dopamine seeking behavior late at night").

IMPORTANT: 
- Return exactly 4 items in the array: The ORIGINAL first, then the 3 variations.
- You must generate the tweet content, explanation, and strategy reasoning in ${language === 'TR' ? 'TURKISH (Türkçe)' : 'ENGLISH'}.
- Return the response in strictly valid JSON format.
`;

export const generateOptimizedTweets = async (rawInput: string, language: Language, userApiKey?: string): Promise<OptimizedTweet[]> => {
  const apiKey = userApiKey || process.env.API_KEY;
  
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', 
      contents: `Input content: "${rawInput}". \n\n 1. Score this input (CRITICAL: If score is low, list specific faults in explanation). 2. Rewrite it into 3 viral formats in ${language === 'TR' ? 'Turkish' : 'English'} with detailed Turkey-specific power hour strategies if TR.`,
      config: {
        systemInstruction: getSystemInstruction(language),
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              content: { type: Type.STRING, description: "The tweet text." },
              type: { type: Type.STRING, enum: [TweetType.ORIGINAL, TweetType.VIRAL_HOOK, TweetType.ENGAGEMENT_BAIT, TweetType.VALUE_THREAD] },
              score: { type: Type.NUMBER, description: "Predicted Algo Score (0-100)" },
              explanation: { type: Type.STRING, description: "Technical explanation." },
              postingStrategy: {
                type: Type.OBJECT,
                properties: {
                    bestTime: { type: Type.STRING, description: "e.g. 21:00 - 22:30 (TRT)" },
                    bestDay: { type: Type.STRING, description: "e.g. Salı & Perşembe" },
                    reasoning: { type: Type.STRING, description: "Detailed psychological reasoning for this time slot." }
                }
              },
              predictedMetrics: {
                type: Type.OBJECT,
                properties: {
                  pLike: { type: Type.STRING },
                  pReply: { type: Type.STRING },
                  pRepost: { type: Type.STRING },
                  pDwell: { type: Type.STRING },
                }
              }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Algorithm.");
    
    return JSON.parse(text) as OptimizedTweet[];

  } catch (error) {
    console.error("Algorithm Failure:", error);
    throw error;
  }
};