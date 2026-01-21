
import React, { useState, useEffect, useRef } from 'react';
import MatrixRain from './components/MatrixRain';
import SnowEffect from './components/SnowEffect';
import TerminalOutput from './components/TerminalOutput';
import ResultCard from './components/ResultCard';
import TrendTicker from './components/TrendTicker';
import ImpactSimulation from './components/ImpactSimulation';
import HookTestCenter from './components/HookTestCenter';
import AudienceOnboarding from './components/AudienceOnboarding';
import AudienceProfileCard from './components/AudienceProfileCard';
import { generateOptimizedTweets } from './services/geminiService';
import { AudienceService } from './services/audienceService';
import { AppState, LogEntry, OptimizedTweet, Language, Tone, OperationLog, TweetType, AudienceProfile } from './types';

// Risky words list for shadowban scanning
const RISKY_WORDS = [
  'adult', 'nude', 'hate', 'scam', 'crypto-scam', 'kill', 'violence', 'porn', 
  'kumar', 'bahis', 'çıplak', 'şiddet', 'dolandır', 'hakaret', 'terör', 'escort', 'jigolo'
];

const UI_TEXT = {
  EN: {
    title: 'X_AlgoHacker',
    subtitle: '// OPEN_SOURCE_ALGORITHM_OPTIMIZER // HEAVY_RANKER_COMPLIANT',
    placeholder: 'Enter raw thought data for optimization...',
    stylePlaceholder: 'Optional: @handle',
    styleLabel: 'STYLE_HACK (OPTIONAL)',
    buttonIdle: 'EXECUTE ALGO HACK',
    buttonAudit: 'TEST TWEET ONLY',
    buttonProcessing: 'HACKING_ALGORITHM...',
    buttonAuditProcessing: 'RUNNING_AUDIT...',
    settings: 'MODULATION_CONTROLS',
    historyTitle: 'MISSION_RECAP',
    riskDetected: 'WARNING: RISK_DETECTED',
    snowToggle: '❄️ LET_IT_SNOW',
    audienceBtn: '🎯 AUDIENCE_CALIBRATION',
    tones: {
      [Tone.DEFAULT]: 'DEFAULT_ALGO',
      [Tone.FOMO_HYPE]: 'FOMO_HYPE',
      [Tone.FUD_ALERT]: 'FUD_ALERT',
      [Tone.GURU_WISDOM]: 'GURU_WISDOM',
      [Tone.SHITPOST_MEME]: 'SHITPOST_MEME',
      [Tone.OFFICIAL_NEWS]: 'OFFICIAL_NEWS'
    },
    tiers: {
      'NEW': '🐣 NEW (Cold Start)',
      'ACTIVE': '👤 ACTIVE (Standard)',
      'VERIFIED': '💎 VERIFIED (Blue)',
      'WHALE': '🐳 WHALE (Phenom)'
    },
    logs: {
      init: "X-AlgoHacker v2.5.0 Online.",
      start: "INIT: Heavy Ranker Connection...",
      success: "SUCCESS: Algorithm hacked successfully.",
      error: "CRITICAL: Node rejection detected.",
      risk: "ALERT: Found terms that may trigger shadowban."
    }
  },
  TR: {
    title: 'X_AlgoHacker',
    subtitle: '// AÇIK_KAYNAK_ALGORİTMA_OPTİMİZATÖRÜ // HEAVY_RANKER_UYUMLU',
    placeholder: 'Optimizasyon için ham düşünce verisini girin...',
    stylePlaceholder: 'Opsiyonel: @hesap',
    styleLabel: 'STİL_HACK (OPSİYONEL)',
    buttonIdle: 'ALGORİTMAYI HACKLE',
    buttonAudit: 'TWEET TEST',
    buttonProcessing: 'ALGORİTMA HACKLENİYOR...',
    buttonAuditProcessing: 'ANALİZ YAPILIYOR...',
    settings: 'MODÜLASYON_KONTROLLERİ',
    historyTitle: 'OPERASYON_GEÇMİŞİ',
    riskDetected: 'TEHLİKE: RİSK_TESPİTİ',
    snowToggle: '❄️ KAR_YAGDIR',
    audienceBtn: '🎯 KİTLE_KALİBRASYONU',
    tones: {
      [Tone.DEFAULT]: 'VARSAYILAN_ALGO',
      [Tone.FOMO_HYPE]: 'FOMO_HAYP',
      [Tone.FUD_ALERT]: 'FUD_ALERTI',
      [Tone.GURU_WISDOM]: 'GURU_BİLGELİĞİ',
      [Tone.SHITPOST_MEME]: 'MEME_PAYLAŞIMI',
      [Tone.OFFICIAL_NEWS]: 'RESMİ_HABER'
    },
    tiers: {
      'NEW': '🐣 NEW (Cold Start)',
      'ACTIVE': '👤 ACTIVE (Standart)',
      'VERIFIED': '💎 VERIFIED (Blue)',
      'WHALE': '🐳 WHALE (Fenomen)'
    },
    logs: {
      init: "X-AlgoritmaHacker v2.5.0 Çevrimiçi.",
      start: "BAŞLATILIYOR: Heavy Ranker Bağlantısı...",
      success: "BAŞARILI: Algoritma başarıyla hacklendi.",
      error: "KRİTİK HATA: Düğüm reddi tespit edildi.",
      risk: "UYARI: Shadowban tetikleyebilecek hassas kelimeler bulundu."
    }
  }
};

const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [targetProfile, setTargetProfile] = useState('');
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [results, setResults] = useState<OptimizedTweet[]>([]);
  const [language, setLanguage] = useState<Language>('TR');
  const [isSnowing, setIsSnowing] = useState(false);
  const [selectedTone, setSelectedTone] = useState<Tone>(Tone.DEFAULT);
  const [isThreadMode, setIsThreadMode] = useState(false);
  const [accountTier, setAccountTier] = useState('ACTIVE');
  const [history, setHistory] = useState<OperationLog[]>([]);
  const [detectedRisks, setDetectedRisks] = useState<string[]>([]);
  const [isAuditMode, setIsAuditMode] = useState(false);
  
  // Audience State
  const [audienceProfile, setAudienceProfile] = useState<AudienceProfile | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const lastLoggedRisks = useRef<string>('');
  const text = UI_TEXT[language];

  useEffect(() => {
    // Load profile on mount
    const savedProfile = AudienceService.loadProfile();
    setAudienceProfile(savedProfile);
    
    // Optional: If no profile exists, show onboarding automatically? 
    // Uncomment next line if you want auto-popup
    // if (!savedProfile) setShowOnboarding(true);
  }, []);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, { 
      id: Math.random().toString(36).substr(2, 9), 
      message, 
      timestamp: new Date().toLocaleTimeString(language === 'TR' ? 'tr-TR' : 'en-US', { hour12: false }) 
    }]);
  };

  useEffect(() => {
    // Shadowban Scanner logic
    const risks = RISKY_WORDS.filter(word => input.toLowerCase().includes(word));
    setDetectedRisks(risks);
    
    // Anti-spam: Only log if risk set actually changes
    const risksString = risks.join(',');
    if (risks.length > 0 && risksString !== lastLoggedRisks.current) {
      addLog(`${text.riskDetected}: [${risks.join(', ')}]`);
      lastLoggedRisks.current = risksString;
    } else if (risks.length === 0) {
      lastLoggedRisks.current = '';
    }
  }, [input, text.riskDetected]);

  const handleSubmit = async (auditOnly: boolean = false) => {
    if (!input.trim()) return;

    setAppState(AppState.PROCESSING);
    setIsAuditMode(auditOnly);
    setResults([]);
    setLogs([]);
    addLog(text.logs.start);
    addLog(language === 'TR' ? "AĞA SIZILIYOR: SimClusters protokolü bypass ediliyor..." : "PENETRATING_NETWORK: Bypassing SimClusters protocol...");
    
    if (audienceProfile) {
        addLog(language === 'TR' 
          ? `HEDEF KİTLE KİLİTLENDİ: ${audienceProfile.niche.toUpperCase()} protokolü aktif.` 
          : `TARGET AUDIENCE LOCKED: ${audienceProfile.niche.toUpperCase()} protocol active.`);
    }

    if (auditOnly) {
       addLog(language === 'TR' ? "MOD: Sadece Analiz (Varyasyonlar devre dışı)..." : "MODE: Audit Only (Variations disabled)...");
    }

    if (targetProfile.trim()) {
      addLog(language === 'TR' ? `STİL ENJEKSİYONU: ${targetProfile} yazım dili taklit ediliyor...` : `STYLE_INJECTION: Mimicking writing style of ${targetProfile}...`);
    }
    
    try {
      const data = await generateOptimizedTweets(
        input, 
        language, 
        selectedTone, 
        isThreadMode,
        accountTier,
        targetProfile.trim() || undefined,
        auditOnly,
        audienceProfile || undefined
      );

      setResults(data);
      setAppState(AppState.COMPLETE);
      addLog(text.logs.success);
      
      setHistory(prev => [{
        id: Math.random().toString(36).substr(2, 5).toUpperCase(),
        timestamp: new Date().toLocaleTimeString(language === 'TR' ? 'tr-TR' : 'en-US'),
        inputSnippet: input.substring(0, 40) + "...",
        results: data,
        language
      }, ...prev].slice(0, 6));

    } catch (error) {
      console.error(error);
      setAppState(AppState.ERROR);
      addLog(text.logs.error);
    }
  };

  const handleAudienceComplete = (profile: AudienceProfile) => {
    setAudienceProfile(profile);
    setShowOnboarding(false);
    addLog(language === 'TR' ? "PROFİL KALİBRASYONU TAMAMLANDI." : "PROFILE CALIBRATION COMPLETE.");
  };

  const handleResetProfile = () => {
    AudienceService.clearProfile();
    setAudienceProfile(null);
    setShowOnboarding(true);
  };

  const originalTweet = results.find(r => r.type === TweetType.ORIGINAL);
  const optimizedTweets = results.filter(r => r.type !== TweetType.ORIGINAL);
  const bestCandidate = optimizedTweets.sort((a,b) => b.score - a.score)[0];

  return (
    <div className="min-h-screen relative text-matrix-green font-mono selection:bg-matrix-green selection:text-black pb-24 bg-black overflow-x-hidden">
      <MatrixRain />
      {isSnowing && <SnowEffect />}
      <div className="fixed inset-0 crt-overlay pointer-events-none z-50"></div>
      
      {showOnboarding && <AudienceOnboarding onComplete={handleAudienceComplete} language={language} />}

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        <header className="mb-8 border-b border-matrix-green/30 pb-4 flex justify-between items-end">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase glitch-text">{text.title}</h1>
            <p className="text-matrix-dim text-[10px] tracking-[0.2em] mt-1">{text.subtitle}</p>
          </div>
          <div className="flex border border-matrix-green/40 bg-black/80">
             <button onClick={() => setLanguage('EN')} className={`px-4 py-1 text-xs font-bold ${language === 'EN' ? 'bg-matrix-green text-black' : 'text-matrix-green'}`}>EN</button>
             <button onClick={() => setLanguage('TR')} className={`px-4 py-1 text-xs font-bold ${language === 'TR' ? 'bg-matrix-green text-black' : 'text-matrix-green'}`}>TR</button>
          </div>
        </header>

        <TrendTicker />

        <section className="mb-6 bg-zinc-950 border border-matrix-darkGreen p-5 shadow-2xl">
             <div className="text-[10px] text-matrix-dim uppercase mb-4 font-black tracking-widest flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-matrix-green rounded-full animate-pulse"></span> {text.settings}
                </div>
                {!audienceProfile && (
                    <button 
                        onClick={() => setShowOnboarding(true)}
                        className="text-[9px] bg-matrix-green/10 hover:bg-matrix-green/20 text-matrix-green border border-matrix-green/40 px-2 py-1 uppercase tracking-widest transition-all"
                    >
                        {text.audienceBtn}
                    </button>
                )}
             </div>
             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* 1. Tone Modulator */}
                <div className="min-w-0">
                    <label className="block text-matrix-green text-[9px] mb-2 uppercase font-bold">TONE_MODULATOR</label>
                    <select value={selectedTone} onChange={(e) => setSelectedTone(e.target.value as Tone)} className="w-full bg-black border border-matrix-dim text-white p-2 text-[10px] focus:border-matrix-green outline-none uppercase font-mono">
                        {Object.keys(text.tones).map((t) => (
                            <option key={t} value={t}>{text.tones[t as Tone]}</option>
                        ))}
                    </select>
                </div>
                {/* 2. Authority */}
                <div className="min-w-0">
                    <label className="block text-matrix-green text-[9px] mb-2 uppercase font-bold">AUTHORITY</label>
                    <select value={accountTier} onChange={(e) => setAccountTier(e.target.value)} className="w-full bg-black border border-matrix-dim text-white p-2 text-[10px] focus:border-matrix-green outline-none uppercase font-mono truncate">
                        {Object.keys(text.tiers).map((key) => (
                            <option key={key} value={key} className="bg-black text-white">{text.tiers[key as keyof typeof text.tiers]}</option>
                        ))}
                    </select>
                </div>
                {/* 3. Style Hack */}
                <div className="min-w-0">
                    <label className="block text-matrix-green text-[9px] mb-2 uppercase font-bold">{text.styleLabel}</label>
                    <input 
                      type="text" 
                      placeholder={text.stylePlaceholder}
                      value={targetProfile}
                      onChange={(e) => setTargetProfile(e.target.value)}
                      className="w-full bg-black border border-matrix-dim text-white p-2 text-[10px] focus:border-matrix-green outline-none font-mono placeholder:text-zinc-700"
                    />
                </div>
                {/* 4. Thread Mode */}
                <div className="flex items-end pb-1 min-w-0">
                    <label className="flex items-center cursor-pointer select-none">
                        <input type="checkbox" className="sr-only" checked={isThreadMode} onChange={(e) => setIsThreadMode(e.target.checked)} />
                        <div className={`w-10 h-5 border-2 border-matrix-green/30 relative transition-all ${isThreadMode ? 'bg-matrix-green/20' : 'bg-black'}`}>
                            <div className={`absolute top-0.5 left-0.5 w-3 h-3 transition-all ${isThreadMode ? 'translate-x-5 bg-matrix-green' : 'bg-matrix-dim'}`}></div>
                        </div>
                        <span className={`ml-3 text-[9px] uppercase font-black tracking-widest ${isThreadMode ? 'text-white' : 'text-zinc-600'}`}>THREAD</span>
                    </label>
                </div>
             </div>
        </section>

        <section className="mb-8">
            {audienceProfile && (
                <AudienceProfileCard 
                    profile={audienceProfile} 
                    language={language} 
                    onReset={handleResetProfile} 
                />
            )}

            <div className="bg-zinc-950 border-t border-x border-zinc-800 p-2 flex justify-between items-center text-[10px]">
                <div className="flex gap-4 items-center h-4">
                    {detectedRisks.length > 0 && (
                      <span className="text-red-500 font-bold animate-pulse flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                        {text.riskDetected}
                      </span>
                    )}
                </div>
            </div>
            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={text.placeholder}
                className={`w-full h-40 bg-black border-2 ${detectedRisks.length > 0 ? 'border-red-900 shadow-[inset_0_0_20px_rgba(255,0,0,0.1)]' : 'border-matrix-darkGreen'} p-5 text-white focus:outline-none focus:border-matrix-green transition-all font-mono text-sm leading-relaxed`}
                disabled={appState === AppState.PROCESSING}
            />
            <div className="grid grid-cols-5 gap-0">
                <button
                    onClick={() => handleSubmit(false)}
                    disabled={appState === AppState.PROCESSING || !input.trim()}
                    className={`col-span-3 py-4 text-sm font-black uppercase tracking-[0.2em] border-l-2 border-y-2 transition-all
                        ${appState === AppState.PROCESSING 
                            ? 'bg-matrix-darkGreen text-black cursor-wait animate-pulse border-r-2' 
                            : 'bg-black border-matrix-green text-matrix-green hover:bg-matrix-green hover:text-black'
                        }`}
                >
                    {appState === AppState.PROCESSING && !isAuditMode ? text.buttonProcessing : text.buttonIdle}
                </button>
                <button
                    onClick={() => handleSubmit(true)}
                    disabled={appState === AppState.PROCESSING || !input.trim()}
                    className={`col-span-2 py-4 text-sm font-black uppercase tracking-[0.2em] border-2 transition-all
                        ${appState === AppState.PROCESSING 
                            ? 'bg-zinc-800 text-zinc-500 cursor-wait' 
                            : 'bg-black border-zinc-600 text-zinc-400 hover:bg-zinc-800 hover:text-white hover:border-zinc-400'
                        }`}
                >
                    {appState === AppState.PROCESSING && isAuditMode ? text.buttonAuditProcessing : text.buttonAudit}
                </button>
            </div>
        </section>

        {(appState === AppState.PROCESSING || logs.length > 0) && <TerminalOutput logs={logs} />}

        {appState === AppState.COMPLETE && results.length > 0 && (
            <div className="mt-12 space-y-16">
                
                {/* 
                   If Audit Mode: Only show the ORIGINAL card.
                   If Hack Mode: Show Impact Simulation (A/B), Hook Tests, and Candidates.
                */}
                
                {!isAuditMode && originalTweet && bestCandidate && (
                    <ImpactSimulation original={originalTweet} optimized={bestCandidate} language={language} />
                )}
                
                {!isAuditMode && bestCandidate && bestCandidate.alternativeHooks && (
                    <HookTestCenter hooks={bestCandidate.alternativeHooks} language={language} />
                )}

                <div className="space-y-10">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-black text-white whitespace-nowrap uppercase">
                            {isAuditMode 
                              ? (language === 'TR' ? 'TWEET ANALİZ RAPORU' : 'TWEET AUDIT REPORT') 
                              : (language === 'TR' ? 'OPTİMİZE_ADAYLAR' : 'OPTIMIZED_CANDIDATES')
                            }
                        </h2>
                        <div className="h-px bg-matrix-green/20 w-full"></div>
                    </div>

                    {/* Show Original first if Audit Mode, otherwise hide Original from list and show only optimized */}
                    {isAuditMode && originalTweet && (
                         <ResultCard tweet={originalTweet} index={0} language={language} />
                    )}

                    {!isAuditMode && optimizedTweets.map((tweet, idx) => (
                        <ResultCard key={idx} tweet={tweet} index={idx + 1} language={language} />
                    ))}
                </div>
            </div>
        )}
      </div>

      {/* Snow Toggle Button */}
      <button 
        onClick={() => setIsSnowing(!isSnowing)}
        className={`fixed bottom-8 right-8 z-[70] bg-black/80 border border-matrix-green/40 p-3 text-[10px] font-black tracking-widest text-matrix-green hover:bg-matrix-green hover:text-black transition-all shadow-[0_0_15px_rgba(0,255,65,0.1)] ${isSnowing ? 'bg-matrix-green/20' : ''}`}
      >
        {text.snowToggle}
      </button>
    </div>
  );
};

export default App;
