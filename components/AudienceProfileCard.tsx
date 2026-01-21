
import React from 'react';
import { AudienceProfile, Language } from '../types';

interface Props {
  profile: AudienceProfile;
  language: Language;
  onReset: () => void;
}

const AudienceProfileCard: React.FC<Props> = ({ profile, language, onReset }) => {
  const confidenceColor = {
    low: 'text-yellow-500',
    medium: 'text-blue-500',
    high: 'text-matrix-green'
  }[profile.confidence];

  const confidenceLabel = {
    EN: { low: 'Basic', medium: 'Calibrated', high: 'Optimized' },
    TR: { low: 'Temel', medium: 'Kalibre', high: 'Optimize' }
  }[language][profile.confidence];

  return (
    <div className="bg-zinc-950 border border-matrix-darkGreen p-4 mb-6 shadow-lg relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-20 h-20 bg-matrix-green/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
      
      <div className="flex justify-between items-start mb-3 relative z-10">
        <div>
          <h3 className="text-[10px] text-matrix-dim uppercase tracking-widest mb-1 flex items-center gap-2">
            <span className="w-2 h-2 border border-matrix-dim"></span>
            {language === 'TR' ? 'AKTİF_KİTLE_PROFİLİ' : 'ACTIVE_AUDIENCE_PROFILE'}
          </h3>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold uppercase ${confidenceColor}`}>
              {confidenceLabel}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-matrix-green animate-pulse" />
          </div>
        </div>
        <button
          onClick={onReset}
          className="text-[9px] text-matrix-dim hover:text-red-500 transition-colors uppercase tracking-widest border border-matrix-dim/30 hover:border-red-500 px-3 py-1 bg-black/50"
        >
          {language === 'TR' ? 'YENİDEN KALİBRE ET' : 'RE-CALIBRATE'}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[10px] relative z-10">
        <div>
          <span className="text-matrix-dim uppercase block mb-1">Niche</span>
          <span className="text-white font-bold uppercase tracking-wider">{profile.niche.replace(/_/g, ' ')}</span>
        </div>
        <div>
          <span className="text-matrix-dim uppercase block mb-1">Style</span>
          <span className="text-white font-bold uppercase tracking-wider">{profile.contentStyle.replace(/_/g, ' ')}</span>
        </div>
        <div>
          <span className="text-matrix-dim uppercase block mb-1">Level</span>
          <span className="text-white font-bold uppercase tracking-wider">{profile.expertiseLevel}</span>
        </div>
        <div>
          <span className="text-matrix-dim uppercase block mb-1">Format</span>
          <span className="text-white font-bold uppercase tracking-wider">{profile.preferredFormat.replace(/_/g, ' ')}</span>
        </div>
      </div>

      {profile.primaryInterests.length > 0 && (
        <div className="mt-4 pt-3 border-t border-matrix-darkGreen/50 relative z-10">
          <span className="text-[9px] text-matrix-dim uppercase block mb-2 opacity-70">
            {language === 'TR' ? 'ÖNCELİKLİ İLGİ ALANLARI' : 'PRIMARY INTERESTS'}
          </span>
          <div className="flex flex-wrap gap-2">
            {profile.primaryInterests.slice(0, 5).map((interest, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 bg-matrix-green/10 border border-matrix-green/20 text-matrix-green text-[9px] uppercase tracking-wide font-mono"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AudienceProfileCard;
