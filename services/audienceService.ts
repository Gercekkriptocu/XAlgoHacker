
import { AudienceProfile, Answer, ContentStyle, TonePreference, ExpertiseLevel, PreferredFormat } from '../types';
import { NICHE_OPTIMIZATION_RULES } from '../data/audienceData';

export class AudienceService {
  
  static buildProfile(answers: Answer[]): AudienceProfile {
    // Extract data from answers
    const influencerAnswer = answers.find(a => a.questionId === 'influencers');
    const contentStyleAnswer = answers.find(a => a.questionId === 'content_style');
    const expertiseAnswer = answers.find(a => a.questionId === 'expertise');
    const formatAnswer = answers.find(a => a.questionId === 'format');
    const nicheDetailAnswer = answers.find(a => a.questionId === 'niche_detail');

    // Combine all tags
    const allTags = answers.flatMap(a => a.tags);
    
    // Determine primary niche
    const niche = influencerAnswer?.value as string || 'general';
    
    // Build profile
    const profile: AudienceProfile = {
      niche,
      primaryInterests: allTags.slice(0, 5), // Top 5 interests
      contentStyle: (contentStyleAnswer?.value as ContentStyle) || 'educational',
      tonePreference: this.determineTone(niche, contentStyleAnswer?.value as string),
      expertiseLevel: (expertiseAnswer?.value as ExpertiseLevel) || 'intermediate',
      preferredFormat: (formatAnswer?.value as PreferredFormat) || 'threads',
      confidence: nicheDetailAnswer ? 'high' : 'medium',
      createdAt: new Date().toISOString()
    };

    return profile;
  }

  static determineTone(niche: string, contentStyle: string): TonePreference {
    // Logic to determine tone based on niche and content style
    if (niche === 'crypto') return 'hype';
    if (niche === 'fitness') return 'motivational';
    if (niche === 'tech_startup') return 'professional';
    if (contentStyle === 'controversial') return 'casual';
    if (contentStyle === 'educational') return 'professional';
    return 'casual';
  }

  static getOptimizationRules(profile: AudienceProfile) {
    return NICHE_OPTIMIZATION_RULES[profile.niche as keyof typeof NICHE_OPTIMIZATION_RULES] 
      || NICHE_OPTIMIZATION_RULES.tech_startup; // Default fallback
  }

  static saveProfile(profile: AudienceProfile): void {
    localStorage.setItem('audienceProfile', JSON.stringify(profile));
  }

  static loadProfile(): AudienceProfile | null {
    const stored = localStorage.getItem('audienceProfile');
    return stored ? JSON.parse(stored) : null;
  }

  static clearProfile(): void {
    localStorage.removeItem('audienceProfile');
  }
}
