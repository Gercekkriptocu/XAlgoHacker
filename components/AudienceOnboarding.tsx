
import React, { useState } from 'react';
import { ONBOARDING_QUESTIONS } from '../data/audienceData';
import { AudienceProfile, Answer, Language } from '../types';
import { AudienceService } from '../services/audienceService';

interface Props {
  onComplete: (profile: AudienceProfile) => void;
  language: Language;
}

const AudienceOnboarding: React.FC<Props> = ({ onComplete, language }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [textInput, setTextInput] = useState('');

  const currentQuestion = ONBOARDING_QUESTIONS[currentStep];
  const progress = ((currentStep + 1) / ONBOARDING_QUESTIONS.length) * 100;

  const handleOptionSelect = (value: string, tags: string[]) => {
    const newAnswer: Answer = {
      questionId: currentQuestion.id,
      value,
      tags
    };

    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);

    // Move to next question or finish
    if (currentStep < ONBOARDING_QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      finishOnboarding(updatedAnswers);
    }
  };

  const handleTextSubmit = () => {
    if (!textInput.trim()) return;

    const newAnswer: Answer = {
      questionId: currentQuestion.id,
      value: textInput,
      tags: extractTagsFromText(textInput)
    };

    const updatedAnswers = [...answers, newAnswer];
    finishOnboarding(updatedAnswers);
  };

  const extractTagsFromText = (text: string): string[] => {
    // Simple keyword extraction
    const keywords = text.toLowerCase().split(/\s+/);
    return keywords.filter(k => k.length > 3).slice(0, 3);
  };

  const finishOnboarding = (finalAnswers: Answer[]) => {
    const profile = AudienceService.buildProfile(finalAnswers);
    AudienceService.saveProfile(profile);
    onComplete(profile);
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setAnswers(answers.slice(0, -1));
    }
  };

  const handleSkip = () => {
    // Create minimal profile
    const minimalProfile: AudienceProfile = {
      niche: 'general',
      primaryInterests: ['general'],
      contentStyle: 'educational',
      tonePreference: 'casual',
      expertiseLevel: 'intermediate',
      preferredFormat: 'threads',
      confidence: 'low',
      createdAt: new Date().toISOString()
    };
    AudienceService.saveProfile(minimalProfile);
    onComplete(minimalProfile);
  };

  return (
    <div className="fixed inset-0 bg-black/98 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="max-w-2xl w-full bg-zinc-950 border-2 border-matrix-green shadow-[0_0_50px_rgba(0,255,65,0.15)]">
        
        {/* Header */}
        <div className="border-b border-matrix-green/30 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-black text-matrix-green uppercase tracking-wider">
              {language === 'TR' ? 'KİTLE_KALİBRASYONU' : 'AUDIENCE_CALIBRATION'}
            </h2>
            <button 
              onClick={handleSkip}
              className="text-xs text-matrix-dim hover:text-matrix-green transition-colors uppercase tracking-widest"
            >
              {language === 'TR' ? 'ATLA →' : 'SKIP →'}
            </button>
          </div>
          
          {/* Progress bar */}
          <div className="relative h-2 bg-zinc-900 border border-matrix-darkGreen">
            <div 
              className="absolute inset-y-0 left-0 bg-matrix-green transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-matrix-dim uppercase tracking-widest">
            <span>STEP {currentStep + 1}/{ONBOARDING_QUESTIONS.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Question */}
        <div className="p-8">
          <p className="text-lg text-white mb-8 leading-relaxed">
            {currentQuestion.text[language]}
          </p>

          {/* Options */}
          {currentQuestion.type === 'single_choice' && (
            <div className="space-y-3">
              {currentQuestion.options?.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(option.value, option.tags)}
                  className="w-full p-4 bg-black border-2 border-matrix-darkGreen hover:border-matrix-green hover:bg-matrix-green/5 text-left transition-all group"
                >
                  <div className="flex items-center gap-3">
                    {option.emoji && (
                      <span className="text-2xl">{option.emoji}</span>
                    )}
                    <span className="text-sm text-matrix-green group-hover:text-white transition-colors">
                      {option.label[language]}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Text Input */}
          {currentQuestion.type === 'text_input' && (
            <div>
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleTextSubmit()}
                placeholder={currentQuestion.placeholder?.[language]}
                className="w-full bg-black border-2 border-matrix-darkGreen focus:border-matrix-green p-4 text-white outline-none font-mono text-sm mb-4"
                autoFocus
              />
              <button
                onClick={handleTextSubmit}
                disabled={!textInput.trim()}
                className="w-full py-3 bg-matrix-green text-black font-black uppercase tracking-widest hover:bg-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {language === 'TR' ? 'TAMAMLA' : 'COMPLETE'}
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {currentStep > 0 && (
          <div className="border-t border-matrix-green/30 p-4">
            <button
              onClick={handleBack}
              className="text-xs text-matrix-dim hover:text-matrix-green transition-colors uppercase tracking-widest"
            >
              ← {language === 'TR' ? 'GERİ' : 'BACK'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudienceOnboarding;
