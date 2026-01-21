
import React, { useState } from 'react';

interface ApiKeyModalProps {
  onSave: (key: string) => void;
  language: 'EN' | 'TR';
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onSave, language }) => {
  const [inputKey, setInputKey] = useState('');
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!inputKey.trim().startsWith('AIza')) {
      setError(language === 'TR' ? 'Geçersiz API Anahtarı formatı.' : 'Invalid API Key format.');
      return;
    }
    onSave(inputKey.trim());
  };

  const texts = {
    TR: {
      title: 'SİSTEM KİMLİK DOĞRULAMASI',
      subtitle: '// DEVAM ETMEK İÇİN GÜVENLİK ANAHTARI GEREKLİ',
      label: 'GEMINI_API_ANAHTARI GİRİN:',
      placeholder: 'AIza...',
      button: 'BAĞLANTI KUR',
      help: 'Anahtarınız tarayıcınızda yerel olarak saklanır.',
      link: 'Anahtar Al (Google AI Studio)'
    },
    EN: {
      title: 'SYSTEM AUTHENTICATION',
      subtitle: '// SECURITY KEY REQUIRED TO PROCEED',
      label: 'ENTER GEMINI_API_KEY:',
      placeholder: 'AIza...',
      button: 'ESTABLISH UPLINK',
      help: 'Your key is stored locally in your browser.',
      link: 'Get Key (Google AI Studio)'
    }
  };

  const t = texts[language];

  return (
    <div className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="max-w-md w-full bg-zinc-950 border-2 border-matrix-green shadow-[0_0_50px_rgba(0,255,65,0.2)] p-8 relative overflow-hidden">
        
        {/* Matrix Rain Effect Background Hint */}
        <div className="absolute top-0 left-0 w-full h-1 bg-matrix-green/50 animate-scanline opacity-20 pointer-events-none"></div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-matrix-green uppercase tracking-widest glitch-text mb-2">
            {t.title}
          </h2>
          <p className="text-[10px] text-matrix-dim tracking-[0.3em] font-mono animate-pulse">
            {t.subtitle}
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-xs text-matrix-green font-bold mb-2 uppercase tracking-widest">
              {t.label}
            </label>
            <input
              type="password"
              value={inputKey}
              onChange={(e) => {
                setInputKey(e.target.value);
                setError('');
              }}
              placeholder={t.placeholder}
              className="w-full bg-black border-2 border-matrix-darkGreen focus:border-matrix-green p-3 text-white outline-none font-mono text-sm transition-all shadow-[inset_0_0_10px_rgba(0,0,0,1)]"
            />
            {error && <p className="text-red-500 text-[10px] mt-2 font-mono uppercase">! {error}</p>}
          </div>

          <button
            onClick={handleSave}
            disabled={!inputKey}
            className="w-full py-4 bg-matrix-green text-black font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all disabled:opacity-30 disabled:cursor-not-allowed text-xs"
          >
            {t.button}
          </button>

          <div className="text-center space-y-2">
            <p className="text-[9px] text-zinc-600 font-mono uppercase">
              {t.help}
            </p>
            <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noreferrer"
              className="inline-block text-[10px] text-matrix-dim hover:text-matrix-green border-b border-matrix-dim/30 hover:border-matrix-green transition-colors uppercase tracking-wider"
            >
              [{t.link}]
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;
