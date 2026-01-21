
import { Question } from '../types';

export const ONBOARDING_QUESTIONS: Question[] = [
  {
    id: 'influencers',
    text: {
      EN: 'Which accounts does your audience typically follow?',
      TR: 'Takipçilerin genelde hangi hesapları takip eder?'
    },
    type: 'single_choice',
    options: [
      {
        label: { EN: '🚀 Tech/Startup (@elonmusk, @naval, @paulg)', TR: '🚀 Teknoloji/Startup (@elonmusk, @naval, @paulg)' },
        value: 'tech_startup',
        tags: ['tech', 'startup', 'innovation', 'ai']
      },
      {
        label: { EN: '💰 Crypto/Web3 (@aantonop, @VitalikButerin, @cz_binance)', TR: '💰 Kripto/Web3 (@aantonop, @VitalikButerin, @cz_binance)' },
        value: 'crypto',
        tags: ['crypto', 'blockchain', 'defi', 'nft']
      },
      {
        label: { EN: '📈 Marketing/Business (@garyvee, @tonyrobbins, @ajlkn)', TR: '📈 Pazarlama/İş (@garyvee, @tonyrobbins, @ajlkn)' },
        value: 'marketing',
        tags: ['marketing', 'business', 'entrepreneurship', 'sales']
      },
      {
        label: { EN: '💪 Health/Fitness (@hubermanlab, @jockowillink, @attiamd)', TR: '💪 Sağlık/Fitness (@hubermanlab, @jockowillink, @attiamd)' },
        value: 'fitness',
        tags: ['fitness', 'health', 'wellness', 'nutrition']
      },
      {
        label: { EN: '🎨 Design/Creative (@figma, @dribbble, @awwwards)', TR: '🎨 Tasarım/Yaratıcı (@figma, @dribbble, @awwwards)' },
        value: 'design',
        tags: ['design', 'creative', 'ui', 'ux']
      },
      {
        label: { EN: '🧠 Personal Development (@JamesClear, @AdamMGrant, @BreneBrown)', TR: '🧠 Kişisel Gelişim (@JamesClear, @AdamMGrant, @BreneBrown)' },
        value: 'personal_dev',
        tags: ['personal_growth', 'productivity', 'habits', 'mindset']
      }
    ]
  },
  {
    id: 'content_style',
    text: {
      EN: 'What type of content gets you the most engagement?',
      TR: 'En çok hangi tür içeriklerine engagement alıyorsun?'
    },
    type: 'single_choice',
    options: [
      {
        label: { EN: '📚 Educational threads (How-to, tutorials, breakdowns)', TR: '📚 Eğitici thread\'ler (Nasıl yapılır, öğreticiler, analizler)' },
        value: 'educational',
        tags: ['educational', 'depth', 'value', 'teaching'],
        emoji: '📚'
      },
      {
        label: { EN: '🔥 Hot takes (Controversial opinions, debates)', TR: '🔥 Hot take\'ler (Tartışmalı görüşler, münazaralar)' },
        value: 'controversial',
        tags: ['controversial', 'engagement', 'debate', 'opinion'],
        emoji: '🔥'
      },
      {
        label: { EN: '📖 Personal stories (Journey, experiences, lessons)', TR: '📖 Kişisel hikayeler (Yolculuk, deneyimler, dersler)' },
        value: 'personal_story',
        tags: ['storytelling', 'personal', 'relatable', 'authentic'],
        emoji: '📖'
      },
      {
        label: { EN: '😂 Memes & Shitposts (Humor, viral, relatable)', TR: '😂 Meme\'ler & Shitpost\'lar (Mizah, viral, ilişkilendirilebilir)' },
        value: 'entertaining',
        tags: ['humor', 'viral', 'entertainment', 'memes'],
        emoji: '😂'
      },
      {
        label: { EN: '📊 Data & Charts (Analytics, metrics, insights)', TR: '📊 Veri & Grafikler (Analitik, metrikler, içgörüler)' },
        value: 'data_driven',
        tags: ['data', 'analytics', 'metrics', 'insights'],
        emoji: '📊'
      }
    ]
  },
  {
    id: 'expertise',
    text: {
      EN: 'How would you describe your expertise level in your niche?',
      TR: 'Niche\'inizdeki uzmanlık seviyenizi nasıl tanımlarsınız?'
    },
    type: 'single_choice',
    options: [
      {
        label: { EN: '🐣 Beginner (Learning, exploring, asking questions)', TR: '🐣 Başlangıç (Öğreniyorum, keşfediyorum, soru soruyorum)' },
        value: 'beginner',
        tags: ['learning', 'curious', 'questions'],
        emoji: '🐣'
      },
      {
        label: { EN: '📈 Intermediate (Some experience, building, growing)', TR: '📈 Orta Seviye (Biraz deneyim, inşa ediyorum, büyüyorum)' },
        value: 'intermediate',
        tags: ['building', 'growing', 'practical'],
        emoji: '📈'
      },
      {
        label: { EN: '🎓 Expert (Deep knowledge, teaching, leading)', TR: '🎓 Uzman (Derin bilgi, öğretiyorum, liderlik ediyorum)' },
        value: 'expert',
        tags: ['expert', 'teaching', 'authority'],
        emoji: '🎓'
      }
    ]
  },
  {
    id: 'format',
    text: {
      EN: 'What format do you prefer posting?',
      TR: 'Hangi formatı paylaşmayı tercih ediyorsun?'
    },
    type: 'single_choice',
    options: [
      {
        label: { EN: '🧵 Long threads (5+ tweets, detailed)', TR: '🧵 Uzun thread\'ler (5+ tweet, detaylı)' },
        value: 'threads',
        tags: ['threads', 'detailed', 'comprehensive'],
        emoji: '🧵'
      },
      {
        label: { EN: '⚡ Short & punchy (1-2 tweets, quick insights)', TR: '⚡ Kısa & etkili (1-2 tweet, hızlı içgörüler)' },
        value: 'short_tweets',
        tags: ['short', 'punchy', 'quick'],
        emoji: '⚡'
      },
      {
        label: { EN: '📊 Polls & questions (Interactive, engagement)', TR: '📊 Anketler & sorular (Etkileşimli, engagement)' },
        value: 'polls',
        tags: ['polls', 'interactive', 'questions'],
        emoji: '📊'
      },
      {
        label: { EN: '🎭 Memes & visuals (Image-heavy, entertaining)', TR: '🎭 Meme\'ler & görseller (Görsel ağırlıklı, eğlenceli)' },
        value: 'memes',
        tags: ['memes', 'visual', 'entertaining'],
        emoji: '🎭'
      }
    ]
  },
  {
    id: 'niche_detail',
    text: {
      EN: 'Describe your niche in a few words (e.g., "AI automation for solopreneurs")',
      TR: 'Niche\'ini birkaç kelimeyle tanımla (örn: "Solo girişimciler için AI otomasyonu")'
    },
    type: 'text_input',
    placeholder: {
      EN: 'e.g., crypto trading, productivity hacks, fitness for busy people...',
      TR: 'örn: kripto trading, verimlilik taktikleri, yoğun insanlar için fitness...'
    }
  }
];

export const NICHE_OPTIMIZATION_RULES = {
  crypto: {
    optimal_length: 120,
    tone: 'urgent + hype',
    keywords: ['$', 'bullish', 'bearish', 'DYOR', 'NFA'],
    avoid: ['guarantee', 'moon', 'lambo', 'get rich'],
    media_preference: 'charts',
    best_times: [9, 14, 21], // UTC
    hooks: [
      '🚨 {coin} just broke {resistance}',
      '📊 Analyzed {number} wallets. Here\'s what I found:',
      'Unpopular opinion: {hot_take}',
      '{timeframe} price prediction: {prediction}'
    ]
  },
  tech_startup: {
    optimal_length: 180,
    tone: 'insightful + data-driven',
    keywords: ['MVP', 'product-market fit', 'growth', 'funding'],
    avoid: ['easy', 'guaranteed success', 'overnight'],
    media_preference: 'metrics_screenshots',
    best_times: [10, 15, 20],
    hooks: [
      'Built {product} to ${mrr} in {time}. Here\'s how:',
      '{Number} lessons from {action}:',
      'We just {milestone}. Thread on what worked 🧵',
      'Unpopular startup opinion: {take}'
    ]
  },
  marketing: {
    optimal_length: 200,
    tone: 'actionable + confident',
    keywords: ['ROI', 'conversion', 'funnel', 'growth hack'],
    avoid: ['secret', 'trick', 'hack (overused)'],
    media_preference: 'infographics',
    best_times: [8, 13, 18],
    hooks: [
      '{Number} {thing} that {result}:',
      'I tested {strategy}. Results:',
      'Most people get {thing} wrong. Here\'s why:',
      '{Timeframe} marketing playbook:'
    ]
  },
  fitness: {
    optimal_length: 160,
    tone: 'motivational + tough love',
    keywords: ['gains', 'transformation', 'discipline', 'consistency'],
    avoid: ['quick fix', 'lose 20lbs in 1 week', 'miracle'],
    media_preference: 'before_after',
    best_times: [6, 12, 18],
    hooks: [
      'Lost {number}lbs in {time}. No BS:',
      '{Exercise} transformation. What changed:',
      'Stop doing {thing}. Here\'s what works:',
      '{Number} fitness myths that are killing your progress:'
    ]
  },
  personal_dev: {
    optimal_length: 220,
    tone: 'wise + relatable',
    keywords: ['habits', 'mindset', 'growth', 'discipline'],
    avoid: ['toxic positivity', 'just hustle', 'sigma grindset'],
    media_preference: 'quote_cards',
    best_times: [7, 13, 21],
    hooks: [
      '{Number} habits that {result}:',
      'At {age}, here\'s what I wish I knew at {younger_age}:',
      'I spent {time} on {thing}. Key lessons:',
      'Unpopular truth: {insight}'
    ]
  },
  design: {
    optimal_length: 140,
    tone: 'aesthetic + insightful',
    keywords: ['UI/UX', 'user flow', 'design system', 'accessibility'],
    avoid: ['simple trick', 'anyone can do', 'in 5 minutes'],
    media_preference: 'design_showcase',
    best_times: [11, 16, 20],
    hooks: [
      'Redesigned {thing}. Before → After:',
      '{Number} design principles that {result}:',
      'Why {popular_design} is actually bad UX:',
      'Design breakdown: {example}'
    ]
  }
};
