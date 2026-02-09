
import { Language, AiProvider } from '../types';

export interface TrendItem {
  title: string;
  searchVolume: string;
  isActive: boolean;
  relatedQueries?: string[];
  category?: string;
}

export interface TrendData {
  trends: TrendItem[];
  region: string;
  fetchedAt: string;
  source: string;
}

// Google Trends Trending Now - Internal RSS endpoint (no key needed)
// This fetches daily trending searches for Turkey
const GOOGLE_TRENDS_RSS_TR = 'https://trends.google.com/trending/rss?geo=TR';
const GOOGLE_TRENDS_RSS_US = 'https://trends.google.com/trending/rss?geo=US';

// Fallback: Google Trends daily trends JSON endpoint  
const GOOGLE_TRENDS_DAILY_TR = 'https://trends.google.com/trends/api/dailytrends?hl=tr&tz=-180&geo=TR&ns=15';

// Cache to avoid spamming requests
let trendCache: TrendData | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

/**
 * Primary method: Fetch from Google Trends RSS feed
 * This is a public endpoint that returns XML with daily trending searches
 */
async function fetchFromGoogleTrendsRSS(region: 'TR' | 'US' | 'GLOBAL'): Promise<TrendItem[]> {
  const url = region === 'US' ? GOOGLE_TRENDS_RSS_US : GOOGLE_TRENDS_RSS_TR;
  
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`RSS fetch failed: ${response.status}`);
    
    const xmlText = await response.text();
    
    // Parse XML manually (browser-safe, no DOMParser dependency issues)
    const items: TrendItem[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    
    while ((match = itemRegex.exec(xmlText)) !== null) {
      const itemXml = match[1];
      
      const title = extractXmlTag(itemXml, 'title');
      const traffic = extractXmlTag(itemXml, 'ht:approx_traffic') || extractXmlTag(itemXml, 'ht:picture_source');
      
      // Extract news items as related queries
      const newsItems: string[] = [];
      const newsRegex = /<ht:news_item_title>([\s\S]*?)<\/ht:news_item_title>/g;
      let newsMatch;
      while ((newsMatch = newsRegex.exec(itemXml)) !== null) {
        newsItems.push(cleanCdata(newsMatch[1]));
      }
      
      if (title) {
        items.push({
          title: cleanCdata(title),
          searchVolume: cleanCdata(traffic || '10K+'),
          isActive: true,
          relatedQueries: newsItems.slice(0, 3),
          category: 'trending'
        });
      }
    }
    
    return items;
  } catch (error) {
    console.warn('Google Trends RSS failed:', error);
    return [];
  }
}

/**
 * Secondary method: Fetch from Google Trends Daily Trends API
 * This is Google's internal API endpoint 
 */
async function fetchFromGoogleTrendsAPI(): Promise<TrendItem[]> {
  try {
    const response = await fetch(GOOGLE_TRENDS_DAILY_TR);
    if (!response.ok) throw new Error(`Daily trends API failed: ${response.status}`);
    
    let text = await response.text();
    // Google prepends ")]}',\n" to prevent JSON hijacking
    if (text.startsWith(')]}\',')) {
      text = text.substring(5);
    }
    
    const data = JSON.parse(text);
    const items: TrendItem[] = [];
    
    const days = data?.default?.trendingSearchesDays || [];
    for (const day of days.slice(0, 2)) { // Last 2 days
      for (const search of (day.trendingSearches || []).slice(0, 10)) {
        items.push({
          title: search.title?.query || 'Unknown',
          searchVolume: search.formattedTraffic || '10K+',
          isActive: true,
          relatedQueries: (search.relatedQueries || []).map((q: any) => q.query).slice(0, 3),
          category: 'daily_trend'
        });
      }
    }
    
    return items;
  } catch (error) {
    console.warn('Google Trends Daily API failed:', error);
    return [];
  }
}

/**
 * Tertiary fallback: Use AI provider to get current trends
 * When Google endpoints are blocked (CORS etc.), ask the AI model
 */
async function fetchTrendsViaAI(
  apiKey: string,
  provider: AiProvider,
  language: Language
): Promise<TrendItem[]> {
  const prompt = language === 'TR'
    ? 'Türkiye\'de şu an X (Twitter) ve Google\'da gündemde olan 10 trending topic\'i JSON array olarak ver. Her biri {"title": "...", "searchVolume": "...", "category": "..."} formatında olsun. Sadece JSON döndür, başka bir şey yazma.'
    : 'Give me 10 currently trending topics in Turkey on X (Twitter) and Google as a JSON array. Each item: {"title": "...", "searchVolume": "...", "category": "..."}. Return only JSON, nothing else.';

  try {
    let jsonString = '';

    if (provider === 'GEMINI') {
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });
      jsonString = response.text || '[]';
    } else {
      const baseUrl = provider === 'OPENAI' 
        ? 'https://api.openai.com/v1'
        : 'https://api.x.ai/v1';
      const model = provider === 'OPENAI' ? 'gpt-4o' : 'grok-2-latest';
      
      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: 'You return only raw JSON arrays. No markdown, no explanation.' },
            { role: 'user', content: prompt }
          ],
          response_format: { type: 'json_object' },
          temperature: 0.3
        })
      });
      
      if (!response.ok) throw new Error(`AI trend fetch failed: ${response.status}`);
      const data = await response.json();
      jsonString = data.choices[0].message.content;
    }
    
    const parsed = JSON.parse(jsonString);
    const rawItems = Array.isArray(parsed) ? parsed : (parsed.trends || parsed.topics || []);
    
    return rawItems.map((item: any) => ({
      title: item.title || item.topic || item.name || 'Unknown',
      searchVolume: item.searchVolume || item.volume || 'N/A',
      isActive: true,
      category: item.category || 'ai_generated',
      relatedQueries: item.relatedQueries || []
    }));
  } catch (error) {
    console.warn('AI trend fetch failed:', error);
    return [];
  }
}

// Helper functions
function extractXmlTag(xml: string, tag: string): string | null {
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`);
  const match = xml.match(regex);
  return match ? match[1] : null;
}

function cleanCdata(text: string): string {
  return text
    .replace(/<!\[CDATA\[/g, '')
    .replace(/\]\]>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim();
}

/**
 * Main export: Fetch trends with cascading fallback strategy
 * 1. Try Google Trends RSS (free, no key)
 * 2. Try Google Trends Daily API (free, no key)
 * 3. Fall back to AI-generated trends (uses existing AI key)
 */
export async function fetchTrends(
  language: Language,
  apiKey?: string,
  provider?: AiProvider
): Promise<TrendData> {
  // Check cache first
  const now = Date.now();
  if (trendCache && (now - lastFetchTime) < CACHE_DURATION) {
    return trendCache;
  }
  
  let trends: TrendItem[] = [];
  let source = '';
  
  // Strategy 1: Google Trends RSS
  trends = await fetchFromGoogleTrendsRSS('TR');
  if (trends.length > 0) {
    source = 'Google Trends RSS';
  }
  
  // Strategy 2: Google Trends Daily API
  if (trends.length === 0) {
    trends = await fetchFromGoogleTrendsAPI();
    if (trends.length > 0) {
      source = 'Google Trends API';
    }
  }
  
  // Strategy 3: AI-powered fallback
  if (trends.length === 0 && apiKey && provider) {
    trends = await fetchTrendsViaAI(apiKey, provider, language);
    if (trends.length > 0) {
      source = `${provider} AI`;
    }
  }
  
  // Final fallback: hardcoded skeleton (should rarely hit)
  if (trends.length === 0) {
    source = 'OFFLINE_CACHE';
    trends = [
      { title: 'Trend verisi yüklenemedi', searchVolume: '-', isActive: false, category: 'system' }
    ];
  }
  
  const result: TrendData = {
    trends: trends.slice(0, 15), // Max 15 trends
    region: 'TR',
    fetchedAt: new Date().toISOString(),
    source
  };
  
  // Update cache
  trendCache = result;
  lastFetchTime = now;
  
  return result;
}

/**
 * Format trends as context string for AI prompt injection
 */
export function formatTrendsForPrompt(trendData: TrendData, language: Language): string {
  if (!trendData.trends.length || trendData.source === 'OFFLINE_CACHE') {
    return '';
  }
  
  const trendList = trendData.trends
    .filter(t => t.isActive)
    .slice(0, 10)
    .map((t, i) => {
      let line = `${i + 1}. "${t.title}" (${t.searchVolume} searches)`;
      if (t.relatedQueries && t.relatedQueries.length > 0) {
        line += ` — Related: ${t.relatedQueries.join(', ')}`;
      }
      return line;
    })
    .join('\n');
  
  if (language === 'TR') {
    return `
**🔴 CANLI GÜNDEM VERİSİ (${trendData.region} — ${new Date(trendData.fetchedAt).toLocaleTimeString('tr-TR')}):**
Kaynak: ${trendData.source}
${trendList}

TALIMAT: Eğer kullanıcının tweet konusu yukarıdaki trendlerden biriyle ilişkiliyse, tweet'i o trendle bağlantılı hale getir. Uygun hashtag veya referans ekle. Eğer ilişkili değilse, trend verisini görmezden gel.
`;
  }
  
  return `
**🔴 LIVE TREND DATA (${trendData.region} — ${new Date(trendData.fetchedAt).toLocaleTimeString('en-US')}):**
Source: ${trendData.source}
${trendList}

INSTRUCTION: If the user's tweet topic relates to any trend above, connect the tweet to that trend. Add relevant hashtag or reference. If unrelated, ignore the trend data.
`;
}

/**
 * Invalidate cache (useful when user changes region or forces refresh)
 */
export function clearTrendCache(): void {
  trendCache = null;
  lastFetchTime = 0;
}
