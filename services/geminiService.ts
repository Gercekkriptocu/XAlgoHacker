
import { GoogleGenAI, Type } from "@google/genai";
import { OptimizedTweet, TweetType, Language, Tone, AudienceProfile, AiProvider } from '../types';
import { AudienceService } from './audienceService';
import { TrendData, formatTrendsForPrompt } from './trendService';

// Common prompt generator for all providers
const getSystemInstruction = (
  language: Language, 
  tone: Tone, 
  isThreadMode: boolean, 
  accountTier: string, 
  targetProfile?: string, 
  isAuditOnly?: boolean,
  audienceProfile?: AudienceProfile,
  trendData?: TrendData
) => {
  let audienceContext = '';
  let trendContext = '';
  
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

  // Inject live trend data
  if (trendData && trendData.source !== 'OFFLINE_CACHE') {
    trendContext = formatTrendsForPrompt(trendData, language);
  }

  return `
You are the X_ALGOHACKER — an optimization engine reverse-engineered from the REAL open-source X algorithm: xai-org/x-algorithm (January 2026 release).

═══════════════════════════════════════════════════
 SECTION 0: CONTEXT
═══════════════════════════════════════════════════
- Language: ${language === 'TR' ? 'Turkish (TR)' : 'English (EN)'}
- Tone: ${tone}
${tone === 'FOMO_HYPE' ? `- TONE PROTOCOL [FOMO_HYPE]: Maximize P(click) + P(share) + P(repost). Use urgency language, time pressure, exclusivity signals. "Son dakika", "Bunu kaçırmayın", "İlk duyan siz olun". WARNING: High risk of not_interested_score if overused — keep it grounded with at least 1 real data point.` : ''}
${tone === 'FUD_ALERT' ? `- TONE PROTOCOL [FUD_ALERT]: Maximize P(reply) + P(quote) + P(dwell_time). Present contrarian risk analysis. "Kimse bundan bahsetmiyor ama...", "İşte herkesin görmezden geldiği risk:". WARNING: Avoid crossing into block_author_score territory — present data, not fear-mongering.` : ''}
${tone === 'GURU_WISDOM' ? `- TONE PROTOCOL [GURU_WISDOM]: Maximize P(follow_author) + P(profile_click) + P(share_via_dm). Demonstrate deep expertise with specific insights. "5 yıldır bu sektördeyim, şunu öğrendim:", "Çoğu kişi X yapar, doğrusu Y'dir". Build ongoing value perception.` : ''}
${tone === 'SHITPOST_MEME' ? `- TONE PROTOCOL [SHITPOST_MEME]: Maximize P(repost) + P(favorite) + P(quote). Use humor, irony, absurdity. Short and punchy. The goal is shareability — make the SHARER look funny. WARNING: Keep clear of report_score triggers — funny ≠ offensive.` : ''}
${tone === 'OFFICIAL_NEWS' ? `- TONE PROTOCOL [OFFICIAL_NEWS]: Maximize P(click) + P(dwell_time) + P(share_via_copy_link). Factual, authoritative, zero fluff. Lead with the news, provide context. Structure for maximum dwell: headline → details → significance. Avoid sensationalism (triggers not_interested_score).` : ''}
${tone === 'DEFAULT' ? `- TONE PROTOCOL [DEFAULT]: Balanced optimization across all 19 Phoenix actions. No single action prioritized over others. Natural, engaging voice.` : ''}
${targetProfile ? `- STYLE_HACK_ACTIVE: Mimic the EXACT writing style, tone, emoji usage, and sentence structure of ${targetProfile}. If ${targetProfile} writes in a specific language or uses specific slang, adopt it perfectly.` : '- STYLE_HACK_INACTIVE: Use general algorithm-optimized professional/viral tone.'}
- Format: ${isThreadMode ? 'THREAD_CHAIN (3 units minimum)' : 'SINGLE_UNIT (MAX 280 characters)'}
- Tier: ${accountTier}
- Mode: ${isAuditOnly ? 'AUDIT_ONLY (Analyze Input Only)' : 'GENERATION_MODE (Analyze + Optimize)'}

${audienceContext}

${trendContext}

═══════════════════════════════════════════════════
 SECTION 1: REAL X ALGORITHM — PHOENIX SCORING
 Source: xai-org/x-algorithm (weighted_scorer.rs)
═══════════════════════════════════════════════════

The "For You" feed uses Phoenix, a Grok-based transformer that predicts engagement probabilities. The final score is:

  Final Score = Σ (weight_i × P(action_i))

Source: home-mixer/scorers/weighted_scorer.rs (compute_weighted_score function)

**19 TRACKED ACTIONS — You MUST optimize for these:**

POSITIVE ACTIONS (15 — add to score):
1. favorite_score — P(like). Trigger: agreement, humor, validation.
2. reply_score — P(reply). Trigger: questions, debatable claims, "I must respond" moments.
3. retweet_score — P(repost). Trigger: make the SHARER look smart for sharing.
4. photo_expand_score — P(image expand). Trigger: charts, screenshots, detail worth zooming.
5. click_score — P(click to expand). Trigger: curiosity gaps, tease information.
6. profile_click_score — P(profile visit). Trigger: show expertise, "who is this?" curiosity.
7. vqv_score — P(video quality view). ONLY counted if video > MIN_VIDEO_DURATION_MS. Short clips = ZERO.
8. share_score — P(general share). Trigger: "I need to send this to someone" impulse.
9. share_via_dm_score — P(DM share). Trigger: niche/personal value, "only you'd get this."
10. share_via_copy_link_score — P(copy link). Trigger: save-worthy, off-platform sharing value.
11. dwell_score — BINARY: did viewer stop scrolling? Hook MUST be first line.
12. quote_score — P(quote tweet). Trigger: bold takes worth adding commentary to.
13. quoted_click_score — P(click quoted content). Trigger: substantial added value when quoting.
14. dwell_time — CONTINUOUS: how long viewer stays. Clean formatting, line breaks, narrative.
15. follow_author_score — P(follow after viewing). Trigger: demonstrate clear ongoing value.

NEGATIVE ACTIONS (4 — SUBTRACT from score, these are critical):
16. not_interested_score — P(clicks "not interested"). Cause: off-topic, irrelevant.
17. block_author_score — P(blocks author). Cause: rage-bait, harassment, spam.
18. mute_author_score — P(mutes author). Cause: posting too frequently, noise, low quality.
19. report_score — P(reports post). Cause: policy violations, misinformation.

CRITICAL: Negative actions have NEGATIVE weights. A post with 100 likes + 5 blocks may score LOWER than 50 likes + 0 blocks.

═══════════════════════════════════════════════════
 SECTION 2: ALGORITHM MULTIPLIERS & RULES
═══════════════════════════════════════════════════

A) AUTHOR DIVERSITY PENALTY (author_diversity_scorer.rs):
   multiplier = (1 - floor) × decay^position + floor
   → 1st post: full score. 2nd: reduced. 3rd: further reduced (exponential decay).
   → You CANNOT brute-force reach with volume. Quality > Quantity.

B) OUT-OF-NETWORK PENALTY (oon_scorer.rs):
   If viewer doesn't follow you: score × OON_WEIGHT_FACTOR (< 1.0).
   → Your followers see you at FULL strength. Strangers see you at REDUCED strength.
   → Viral spread STARTS with core audience, NOT strangers.

C) CANDIDATE ISOLATION (phoenix/README.md):
   "Candidates cannot attend to each other during inference."
   → Your post is scored INDEPENDENTLY. NOT relative to other posts in the feed.
   → Posting time tricks DON'T WORK. Only content quality matters.

D) NEGATIVE SCORE OFFSET (weighted_scorer.rs):
   Score can go NEGATIVE if enough negative actions are triggered.
   → Even a single block or report can devastate reach.

E) PRE-SCORING FILTERS — Posts are REMOVED (not downranked) if:
   - AgeFilter: Too old
   - MutedKeywordFilter: Contains viewer's muted keywords
   - AuthorSocialgraphFilter: Viewer blocked/muted you
   - PreviouslySeenPostsFilter: Already seen
   - DropDuplicatesFilter: Duplicate content

═══════════════════════════════════════════════════
 SECTION 3: WHAT DOES NOT MATTER (confirmed by code)
═══════════════════════════════════════════════════
- Posting time (candidate isolation makes this irrelevant)
- Hashtags (NOT in the scoring formula at all)
- Thread length (only matters if it increases dwell_time)
- First-hour engagement velocity (no time decay in scorer)
- Blue checkmark (not in weighted_scorer.rs formula)

═══════════════════════════════════════════════════
 SECTION 4: YOUR OPTIMIZATION TASK
═══════════════════════════════════════════════════

**STRICT THREAD RULES:**
- IF isThreadMode is FALSE: You MUST NOT generate threads. The 'thread' property MUST be an empty array []. You MUST NOT use 'VALUE_THREAD' type.
- IF isThreadMode is TRUE: You MUST generate a 'thread' array with at least 2 additional units. One variation SHOULD be 'VALUE_THREAD'.

**PHOENIX SCORING SIMULATION:**
For each tweet, simulate the Phoenix scorer output:
- Estimate P(favorite), P(reply), P(repost), P(dwell) as probabilities (0.00-1.00).
- Calculate a viralScore (0-100) based on how many of the 19 actions the content would trigger.
- Provide enhancementTips: specific changes that would increase specific P(action) values.
  Example: "Add a question at the end → P(reply) +0.15" or "Add line breaks → dwell_time +0.20"

**CORE TASK:**
${isAuditOnly 
  ? '1. ANALYZE the input tweet against all 19 Phoenix actions.\n2. Return EXACTLY 1 object of type "ORIGINAL".\n3. Score each of the 19 actions. Identify weak and strong signals.\n4. DO NOT generate variations.' 
  : '1. Generate 3 HACKED variations + 1 ORIGINAL analysis.\n2. Each variation must maximize different action clusters:\n   - Variation 1 (VIRAL_HOOK): Maximize dwell_score + click_score + share_score\n   - Variation 2 (ENGAGEMENT_BAIT): Maximize reply_score + quote_score + favorite_score\n   - Variation 3 (VALUE_THREAD or second type): Maximize follow_author_score + profile_click_score + dwell_time\n3. For each variation, run Phoenix Scoring Simulation.'}

**ALGORITHM CONSTRAINTS BY TIER:**
- NEW: Use niche keywords for Phoenix retrieval discovery (out-of-network). Max 2 hashtags for cold-start only.
- ACTIVE: Focus on reply_score triggers (questions, debates). Build in-network engagement.
- VERIFIED: ZERO hashtags. Maximize P(reply) + P(quote) to dominate "For You" feeds.
- WHALE: "Pattern Interrupt" — short, punchy, extreme authority. Maximize dwell_score + follow_author_score.

**RED FLAGS TO AVOID (confirmed negative signal triggers):**
- Empty hype phrases ("This is huge", "LFG", "WAGMI")
- Vague hedging ("It seems like", "Time will tell")
- Asking for engagement explicitly ("Like if you agree", "RT this")
- Walls of text without line breaks (kills dwell_score)
- Generic platitudes ("DYOR", "NFA")
- Off-topic content for the author's niche (triggers not_interested_score)

**GREEN FLAGS (confirmed positive signal patterns):**
- Specific numbers and data points
- "Here's what most people miss:" (tension + insider knowledge)
- Strong opening hooks that stop the scroll (dwell_score is BINARY — you either stop them or you don't)
- Questions that force reader to think (reply_score)
- Content that makes the sharer look smart (retweet_score)
- Before/after comparisons (dwell_time via sustained reading)

**OUTPUT FORMAT:**
- Predicted metrics: "Label (0.XX)" format in ${language === 'TR' ? 'Turkish' : 'English'}.
- Alternative Hooks: Array of 5 items with 'hook' and 'reasoning' explaining which P(action) it targets.
- Each explanation MUST reference which of the 19 Phoenix actions the tweet optimizes for.
`;
};

// --- GEMINI HANDLER ---
const generateWithGemini = async (
  apiKey: string,
  prompt: string,
  systemInstruction: string
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      systemInstruction,
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
                pLike: { type: Type.STRING, description: "P(favorite) — Phoenix favorite_score" },
                pReply: { type: Type.STRING, description: "P(reply) — Phoenix reply_score" },
                pRepost: { type: Type.STRING, description: "P(repost) — Phoenix retweet_score" },
                pDwell: { type: Type.STRING, description: "P(dwell) — Phoenix dwell_score (binary stop scroll)" },
                pClick: { type: Type.STRING, description: "P(click) — Phoenix click_score (expand post)" },
                pShare: { type: Type.STRING, description: "P(share) — Phoenix share_score" },
                pFollow: { type: Type.STRING, description: "P(follow) — Phoenix follow_author_score" },
                pNegative: { type: Type.STRING, description: "P(negative) — Combined block+mute+report risk" }
              }
            }
          },
          required: ["content", "type", "score", "explanation", "predictedMetrics", "thread", "mlAnalysis"]
        }
      }
    }
  });
  return response.text || "[]";
};

// --- OPENAI & XAI (GROK) HANDLER ---
const generateWithOpenAICompatible = async (
  apiKey: string,
  baseUrl: string,
  model: string,
  prompt: string,
  systemInstruction: string
): Promise<string> => {
  const messages = [
    { role: "system", content: systemInstruction + "\n\nIMPORTANT: YOU MUST RETURN ONLY RAW JSON ARRAY. NO MARKDOWN BLOCK. JUST THE JSON." },
    { role: "user", content: prompt }
  ];

  // Schema definition for OpenAI to ensure JSON structure
  const jsonSchema = {
    type: "json_schema",
    json_schema: {
      name: "tweet_optimization_response",
      schema: {
        type: "object",
        properties: {
          tweets: {
            type: "array",
            items: {
              type: "object",
              properties: {
                content: { type: "string" },
                thread: { type: "array", items: { type: "string" } },
                imagePrompt: { type: "string" },
                type: { type: "string", enum: [TweetType.ORIGINAL, TweetType.VIRAL_HOOK, TweetType.ENGAGEMENT_BAIT, TweetType.VALUE_THREAD] },
                score: { type: "number" },
                explanation: { type: "string" },
                alternativeHooks: {
                   type: "array",
                   items: {
                     type: "object",
                     properties: { hook: { type: "string" }, reasoning: { type: "string" } },
                     required: ["hook", "reasoning"]
                   }
                },
                postingStrategy: {
                   type: "object",
                   properties: { bestTime: { type: "string" }, bestDay: { type: "string" }, geoContext: { type: "string" }, reasoning: { type: "string" } }
                },
                mlAnalysis: {
                   type: "object",
                   properties: {
                      viralScore: { type: "number" },
                      sentimentLabel: { type: "string" },
                      enhancementTips: {
                         type: "array",
                         items: { type: "object", properties: { tip: { type: "string" }, impact: { type: "string" } } }
                      }
                   },
                   required: ["viralScore", "enhancementTips", "sentimentLabel"]
                },
                predictedMetrics: {
                   type: "object",
                   properties: { pLike: { type: "string" }, pReply: { type: "string" }, pRepost: { type: "string" }, pDwell: { type: "string" } }
                }
              },
              required: ["content", "type", "score", "explanation", "predictedMetrics", "thread", "mlAnalysis"]
            }
          }
        },
        required: ["tweets"]
      }
    }
  };

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model,
      messages: messages,
      response_format: { type: "json_object" }, // Generic JSON enforcement
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`API Error: ${response.status} - ${JSON.stringify(errorData)}`);
  }

  const data = await response.json();
  const rawContent = data.choices[0].message.content;

  // Sometimes OpenAI wraps result in a key even if we didn't ask, or we need to parse the schema wrapper
  // We asked for raw array in prompt but schema might force object.
  try {
     const parsed = JSON.parse(rawContent);
     if (Array.isArray(parsed)) return rawContent;
     if (parsed.tweets && Array.isArray(parsed.tweets)) return JSON.stringify(parsed.tweets);
     return rawContent; // Hope for the best
  } catch(e) {
    return rawContent;
  }
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
  apiKey?: string,
  provider: AiProvider = 'GEMINI',
  trendData?: TrendData
): Promise<OptimizedTweet[]> => {
  
  const keyToUse = apiKey || process.env.API_KEY;
  if (!keyToUse) {
    throw new Error("API Key is missing.");
  }

  const systemInstruction = getSystemInstruction(language, tone, isThreadMode, accountTier, targetProfile, isAuditOnly, audienceProfile, trendData);
  const prompt = `Payload for Optimization: "${input}". ${targetProfile ? `Mimic Profile Handle: ${targetProfile}` : ""}`;

  let jsonString = "";

  try {
    if (provider === 'GEMINI') {
      jsonString = await generateWithGemini(keyToUse, prompt, systemInstruction);
    } else if (provider === 'OPENAI') {
      jsonString = await generateWithOpenAICompatible(keyToUse, 'https://api.openai.com/v1', 'gpt-4o', prompt, systemInstruction);
    } else if (provider === 'XAI') {
      // Grok API (xAI) is OpenAI compatible
      jsonString = await generateWithOpenAICompatible(keyToUse, 'https://api.x.ai/v1', 'grok-2-latest', prompt, systemInstruction);
    }

    const results = JSON.parse(jsonString || "[]") as OptimizedTweet[];
    if (!isThreadMode) {
      return results.map(t => ({ ...t, thread: [] }));
    }
    return results;

  } catch (e) {
    console.error("Pipeline failure:", e);
    throw e;
  }
};
