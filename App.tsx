import React, { useState, useRef, useEffect } from 'react';
import MatrixRain from './components/MatrixRain';
import TerminalOutput from './components/TerminalOutput';
import ResultCard from './components/ResultCard';
import TrendTicker from './components/TrendTicker';
import { generateOptimizedTweets } from './services/geminiService';
import { AppState, LogEntry, OptimizedTweet, Language, TweetType } from './types';

const UI_TEXT = {
  EN: {
    title: 'X_AlgoHacker',
    subtitle: '// GROK-BASED OPTIMIZATION ENGINE // FOR_YOU_FEED_INJECTOR',
    inputLabel: 'INPUT_STREAM',
    keyLabel: 'ACCESS_TOKEN (API KEY)',
    placeholder: 'Enter your raw thought, draft, or concept here...',
    keyPlaceholder: 'Enter Gemini API Key...',
    buttonIdle: 'Hack The Algorithm',
    buttonProcessing: 'Running Phoenix Algorithm...',
    resultsTitle: 'OPTIMIZED_CANDIDATES',
    originalTitle: 'INPUT_ANALYSIS',
    logs: {
      init: "X-AlgoHacker v1.0.4 Online.",
      await: "Awaiting input for Candidate Pipeline...",
      processStart: "Receiving input payload",
      complete: "Candidate generation complete.",
      rendering: "Rendering Top-K Results..."
    },
    steps: [
      "Initializing Home Mixer...",
      "Authenticating with Thunder (In-Network)...",
      "Connecting to Phoenix (Out-of-Network Retrieval)...",
      "Hydrating User Action Sequence...",
      "Generating Embeddings via Two-Tower Model...",
      "Applying Candidate Isolation Mask...",
      "Running Grok-1 Transformer Inference...",
      "Calculating P(repost) and P(dwell) vectors...",
      "Filtering blocked authors/muted keywords...",
      "Optimizing for Diversity Scorer...",
      "Finalizing Candidate Selection..."
    ],
    footer: {
      session: "SESSION_ID",
      latency: "THUNDER_LATENCY: 4ms | PHOENIX_LATENCY: 124ms"
    }
  },
  TR: {
    title: 'X_AlgoHacker',
    subtitle: '// GROK TABANLI OPTİMİZASYON MOTORU // FOR_YOU_FEED_ENJEKTÖRÜ',
    inputLabel: 'GİRİŞ_AKIŞI',
    keyLabel: 'ERİŞİM_TOKEN (API ANAHTARI)',
    placeholder: 'Ham düşünceni, taslağını veya konseptini buraya gir...',
    keyPlaceholder: 'Gemini API Anahtarını Gir...',
    buttonIdle: 'Algoritmayı Hackle',
    buttonProcessing: 'Phoenix Algoritması Çalıştırılıyor...',
    resultsTitle: 'OPTİMİZE_ADAYLAR',
    originalTitle: 'GİRİŞ_ANALİZİ',
    logs: {
      init: "X-AlgoHacker v1.0.4 Çevrimiçi.",
      await: "Aday Hattı için giriş bekleniyor...",
      processStart: "Giriş verisi alınıyor",
      complete: "Aday üretimi tamamlandı.",
      rendering: "Top-K Sonuçları İşleniyor..."
    },
    steps: [
      "Home Mixer Başlatılıyor...",
      "Thunder ile Kimlik Doğrulama (Ağ-İçi)...",
      "Phoenix'e Bağlanılıyor (Ağ-Dışı Erişim)...",
      "Kullanıcı Eylem Dizisi İşleniyor...",
      "Two-Tower Modeli ile Embedding Üretiliyor...",
      "Aday İzolasyon Maskesi Uygulanıyor...",
      "Grok-1 Transformer Çıkarımı Çalışıyor...",
      "P(repost) ve P(dwell) Vektörleri Hesaplanıyor...",
      "Engelli yazarlar/sessize alınanlar filtreleniyor...",
      "Çeşitlilik Puanlayıcısı Optimize Ediliyor...",
      "Aday Seçimi Sonuçlandırılıyor..."
    ],
    footer: {
      session: "OTURUM_NO",
      latency: "THUNDER_GECİKMESİ: 4ms | PHOENIX_GECİKMESİ: 124ms"
    }
  }
};

const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [customApiKey, setCustomApiKey] = useState('');
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [results, setResults] = useState<OptimizedTweet[]>([]);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  const [language, setLanguage] = useState<Language>('EN');
  const [minScore, setMinScore] = useState(0);

  const text = UI_TEXT[language];

  useEffect(() => {
     addLog(text.logs.init);
     
     // Check for env key
     if (!process.env.API_KEY) {
         setApiKeyMissing(true);
         addLog("WARNING: System ENV API_KEY not detected.");
         addLog("Manual override required.");
     } else {
         addLog(text.logs.await);
     }
  }, [language]); 

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }) + "." + Math.floor(Math.random() * 999);
    setLogs(prev => [...prev, { id: Math.random().toString(36).substr(2, 9), message, timestamp }]);
  };

  const simulateProcessing = async () => {
    for (const step of text.steps) {
      if (Math.random() > 0.3) {
        addLog(step);
        await new Promise(r => setTimeout(r, Math.random() * 300 + 200));
      }
    }
  };

  const handleSubmit = async () => {
    // If missing env key, user must provide custom key
    if (!input.trim() || (apiKeyMissing && !customApiKey)) return;

    setAppState(AppState.PROCESSING);
    setResults([]);
    setLogs([]);
    setMinScore(0);
    addLog(`${text.logs.processStart}: "${input.substring(0, 20)}..."`);
    
    try {
      const processingPromise = simulateProcessing();
      const apiPromise = generateOptimizedTweets(input, language, customApiKey);

      const [_, data] = await Promise.all([processingPromise, apiPromise]);

      addLog(text.logs.complete);
      addLog(text.logs.rendering);
      setResults(data);
      setAppState(AppState.COMPLETE);

    } catch (error) {
      addLog(`ERR: Pipeline failed. ${error}`);
      setAppState(AppState.ERROR);
    }
  };

  const originalTweet = results.find(r => r.type === TweetType.ORIGINAL);
  const optimizedTweets = results
    .filter(r => r.type !== TweetType.ORIGINAL)
    .filter(r => r.score >= minScore);

  return (
    <div className="min-h-screen relative text-matrix-green font-mono selection:bg-matrix-green selection:text-black">
      <MatrixRain />
      
      {/* CRT Overlay Effect */}
      <div className="fixed inset-0 crt-overlay pointer-events-none z-50"></div>
      <div className="fixed inset-0 bg-gradient-to-b from-transparent to-black/30 pointer-events-none z-40"></div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        
        {/* Header */}
        <header className="mb-8 border-b-2 border-matrix-green pb-4 flex justify-between items-start">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase glitch-text mb-2">
              {text.title}
            </h1>
            <p className="text-matrix-dim text-sm md:text-base">
              {text.subtitle}
            </p>
          </div>
          
          {/* Language Toggle */}
          <div className="flex border border-matrix-green bg-black/80">
             <button 
               onClick={() => setLanguage('EN')} 
               className={`px-3 py-1 font-bold ${language === 'EN' ? 'bg-matrix-green text-black' : 'text-matrix-green hover:bg-matrix-darkGreen'}`}
             >
               EN
             </button>
             <button 
               onClick={() => setLanguage('TR')} 
               className={`px-3 py-1 font-bold ${language === 'TR' ? 'bg-matrix-green text-black' : 'text-matrix-green hover:bg-matrix-darkGreen'}`}
             >
               TR
             </button>
          </div>
        </header>

        <TrendTicker />

        {/* Input Section */}
        <section className="mb-8 space-y-4">
            {apiKeyMissing && (
                <div className="relative group">
                     <div className="absolute top-0 left-0 bg-red-900/80 text-white text-xs px-2 py-1 font-bold border border-red-500/50">
                        {text.keyLabel}
                    </div>
                    <input 
                        type="password"
                        value={customApiKey}
                        onChange={(e) => setCustomApiKey(e.target.value)}
                        placeholder={text.keyPlaceholder}
                        className="w-full bg-black border-2 border-red-900/50 p-4 pt-8 text-white focus:outline-none focus:border-red-500 focus:shadow-[0_0_15px_rgba(255,0,0,0.3)] transition-all"
                    />
                </div>
            )}

            <div className="relative">
                <div className="absolute top-0 left-0 bg-matrix-green text-black text-xs px-2 py-1 font-bold">
                    {text.inputLabel}
                </div>
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={text.placeholder}
                    className="w-full h-32 bg-black border-2 border-matrix-darkGreen p-4 pt-8 text-white focus:outline-none focus:border-matrix-green focus:shadow-[0_0_15px_rgba(0,255,65,0.3)] transition-all resize-none"
                    disabled={appState === AppState.PROCESSING}
                />
            </div>
            
            <button
                onClick={handleSubmit}
                disabled={appState === AppState.PROCESSING || !input.trim() || (apiKeyMissing && !customApiKey)}
                className={`w-full py-3 text-xl font-bold uppercase tracking-widest border-2 transition-all duration-200
                    ${appState === AppState.PROCESSING 
                        ? 'bg-matrix-darkGreen border-matrix-darkGreen text-gray-400 cursor-wait' 
                        : (apiKeyMissing && !customApiKey) 
                            ? 'bg-gray-900 border-gray-700 text-gray-500 cursor-not-allowed'
                            : 'bg-black border-matrix-green text-matrix-green hover:bg-matrix-green hover:text-black hover:shadow-[0_0_20px_rgba(0,255,65,0.6)]'
                    }`}
            >
                {appState === AppState.PROCESSING ? text.buttonProcessing : text.buttonIdle}
            </button>
        </section>

        {/* Logs Section */}
        {(appState === AppState.PROCESSING || logs.length > 0) && (
            <section className="mb-8">
                <TerminalOutput logs={logs} />
            </section>
        )}

        {/* Results Section */}
        {appState === AppState.COMPLETE && results.length > 0 && (
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-1000 space-y-8">
                
                {/* Original Analysis */}
                {originalTweet && (
                    <div>
                        <div className="flex items-center mb-4">
                            <span className="h-px bg-zinc-600 flex-grow opacity-50"></span>
                            <span className="px-4 text-sm font-bold text-gray-400 tracking-widest">{text.originalTitle}</span>
                            <span className="h-px bg-zinc-600 flex-grow opacity-50"></span>
                        </div>
                        <ResultCard tweet={originalTweet} index={0} language={language} />
                    </div>
                )}

                {/* Optimized Candidates */}
                <div>
                    <div className="flex flex-col md:flex-row items-end md:items-center justify-between mb-6 gap-4">
                        <div className="flex items-center w-full">
                            <span className="h-px bg-matrix-green flex-grow opacity-50"></span>
                            <span className="px-4 text-xl font-bold text-white whitespace-nowrap">{text.resultsTitle}</span>
                            <span className="h-px bg-matrix-green flex-grow opacity-50"></span>
                        </div>
                        
                        {/* Score Filter Slider */}
                        <div className="flex items-center space-x-3 w-full md:w-auto bg-black/40 p-2 border border-matrix-darkGreen/50 rounded">
                             <label htmlFor="scoreFilter" className="text-xs font-bold text-matrix-dim uppercase whitespace-nowrap">
                                Min Score: <span className="text-matrix-green">{minScore}</span>
                             </label>
                             <input 
                                id="scoreFilter"
                                type="range" 
                                min="0" 
                                max="100" 
                                value={minScore} 
                                onChange={(e) => setMinScore(Number(e.target.value))}
                                className="w-32 h-1.5 bg-matrix-darkGreen rounded-lg appearance-none cursor-pointer accent-matrix-green outline-none"
                             />
                        </div>
                    </div>
                    
                    <div className="space-y-6">
                        {optimizedTweets.map((tweet, index) => (
                            <ResultCard key={index} tweet={tweet} index={index + 1} language={language} />
                        ))}
                        {optimizedTweets.length === 0 && (
                             <div className="text-center py-12 border border-dashed border-matrix-dim/50 text-matrix-dim font-mono">
                                 [ SYSTEM_NOTICE: NO_CANDIDATES_MEET_THRESHOLD_CRITERIA ]
                             </div>
                        )}
                    </div>
                </div>

                <div className="mt-8 text-center text-matrix-dim text-xs">
                    <p>{text.footer.session}: {Math.random().toString(36).substring(7).toUpperCase()}</p>
                    <p>{text.footer.latency}</p>
                </div>
            </section>
        )}
      </div>
    </div>
  );
};

export default App;