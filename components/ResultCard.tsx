
import React from 'react';
import { OptimizedTweet, TweetType, Language } from '../types';

interface ResultCardProps {
  tweet: OptimizedTweet;
  index: number;
  language: Language;
}

const ResultCard: React.FC<ResultCardProps> = ({ tweet, index, language }) => {
  const getColors = (type: TweetType) => {
    switch (type) {
      case TweetType.ORIGINAL: return { border: 'border-zinc-700', text: 'text-zinc-500', glow: 'group-hover:shadow-[0_0_15px_rgba(63,63,70,0.3)]', accent: 'border-zinc-500', bg: 'bg-zinc-900/50' };
      case TweetType.VIRAL_HOOK: return { border: 'border-rose-500/60', text: 'text-rose-400', glow: 'group-hover:shadow-[0_0_25px_rgba(244,63,94,0.25)]', accent: 'border-rose-400', bg: 'bg-rose-950/10' };
      case TweetType.ENGAGEMENT_BAIT: return { border: 'border-amber-500/60', text: 'text-amber-400', glow: 'group-hover:shadow-[0_0_25px_rgba(245,158,11,0.25)]', accent: 'border-amber-400', bg: 'bg-amber-950/10' };
      case TweetType.VALUE_THREAD: return { border: 'border-cyan-500/60', text: 'text-cyan-400', glow: 'group-hover:shadow-[0_0_25px_rgba(6,182,212,0.25)]', accent: 'border-cyan-400', bg: 'bg-cyan-950/10' };
      default: return { border: 'border-matrix-green', text: 'text-matrix-green', glow: 'group-hover:shadow-[0_0_25px_rgba(0,255,65,0.25)]', accent: 'border-matrix-green', bg: 'bg-black/50' };
    }
  };

  const getTitle = (type: TweetType) => {
    switch (type) {
      case TweetType.ORIGINAL: return 'INPUT_AUDIT_REPORT';
      case TweetType.VIRAL_HOOK: return 'PHOENIX_VIRALITY_BOOST';
      case TweetType.ENGAGEMENT_BAIT: return 'THUNDER_CONVERSATION_DRIVER';
      case TweetType.VALUE_THREAD: return 'GROK_AUTHORITY_BUILDER';
    }
  };

  const labels = {
    EN: { logicTrace: 'Logic Trace:', predictedVectors: 'Predicted Vectors:', powerHour: 'GLOBAL_INJECTION_WINDOW (Power Hour):', copy: 'Copy Tweet', copyThread: 'Copy Full Thread', copyPrompt: 'Copy Image Prompt', score: 'SCORE', imagePrompt: 'GENERATIVE_IMG_PROMPT', threadMarker: 'THREAD_CHAIN', mlTitle: 'RANDOM_FOREST_PREDICTOR', viralProb: 'VIRAL PROBABILITY' },
    TR: { logicTrace: 'Mantık İzi:', predictedVectors: 'Tahmin Vektörleri:', powerHour: 'KÜRESEL ENJEKSİYON PENCERESİ:', copy: 'Tweet\'i Kopyala', copyThread: 'Zinciri Kopyala', copyPrompt: 'Prompt\'u Kopyala', score: 'PUAN', imagePrompt: 'GÖRSEL_ÜRETİM_KODU', threadMarker: 'ZİNCİR_AKIŞI', mlTitle: 'RANDOM_FOREST_TAHMİNLEYİCİ', viralProb: 'VİRAL OLMA İHTİMALİ' }
  };

  const currentLabels = labels[language];
  const isOriginal = tweet.type === TweetType.ORIGINAL;
  const colors = getColors(tweet.type);

  const copyToClipboard = (text: string) => navigator.clipboard.writeText(text);
  const copyThread = () => copyToClipboard([tweet.content, ...(tweet.thread || [])].join('\n\n'));

  // ML Score Color
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className={`relative group ${colors.bg} border-2 ${colors.border} p-6 mb-8 transition-all duration-500 ease-out ${colors.glow} ${!isOriginal && 'hover:-translate-y-1'}`}>
      <div className={`absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 ${colors.accent}`}></div>
      <div className={`absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 ${colors.accent}`}></div>
      <div className={`absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 ${colors.accent}`}></div>
      <div className={`absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 ${colors.accent}`}></div>

      <div className={`flex justify-between items-start mb-6 border-b ${isOriginal ? 'border-zinc-800' : colors.border} border-opacity-30 pb-3`}>
        <h3 className={`${colors.text} font-bold text-lg tracking-widest uppercase`}>
           {isOriginal ? `// ${getTitle(tweet.type)}` : `// CANDIDATE_0${index}: ${getTitle(tweet.type)}`}
        </h3>
        <span className={`${isOriginal ? 'bg-zinc-800 text-zinc-500' : 'bg-black text-white'} border ${colors.border} px-3 py-1 text-xs font-mono font-bold shadow-sm`}>
            {currentLabels.score}: {tweet.score.toFixed(1)}
        </span>
      </div>

      <div className="mb-8 space-y-4">
        <div className={`${isOriginal ? 'text-zinc-500 italic' : 'text-zinc-100'} text-lg whitespace-pre-wrap font-sans leading-relaxed tracking-wide`}>{tweet.content}</div>
        {tweet.thread && tweet.thread.length > 0 && (
            <div className={`pl-6 border-l-4 ${colors.border} border-opacity-40 space-y-6 mt-6`}>
                <div className={`text-[10px] ${colors.text} font-bold uppercase tracking-[0.3em] mb-4 opacity-70`}>▼ {currentLabels.threadMarker}</div>
                {tweet.thread.map((t, i) => <p key={i} className="text-zinc-300 text-base leading-relaxed">{t}</p>)}
            </div>
        )}
      </div>

      {/* ML PREDICTOR SECTION */}
      {tweet.mlAnalysis && (
        <div className="mb-6 bg-zinc-950/80 border border-zinc-800 p-4 font-mono">
            <div className="flex items-center gap-2 mb-4 border-b border-zinc-800 pb-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                <span className="text-[10px] text-blue-400 uppercase font-black tracking-widest">{currentLabels.mlTitle}</span>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6">
                {/* Score Gauge */}
                <div className="flex-shrink-0 w-full md:w-1/3">
                    <div className="text-[9px] text-zinc-500 uppercase mb-1">{currentLabels.viralProb}</div>
                    <div className="relative h-2 bg-zinc-800 rounded-full overflow-hidden mb-2">
                        <div 
                            className={`absolute top-0 left-0 h-full ${tweet.mlAnalysis.viralScore > 75 ? 'bg-green-500' : 'bg-blue-500'}`} 
                            style={{width: `${tweet.mlAnalysis.viralScore}%`}}
                        ></div>
                    </div>
                    <div className={`text-2xl font-black ${getScoreColor(tweet.mlAnalysis.viralScore)}`}>
                        {tweet.mlAnalysis.viralScore}% <span className="text-[10px] text-zinc-500 font-normal">CONFIDENCE</span>
                    </div>
                </div>

                {/* Tips */}
                <div className="flex-1 space-y-2">
                    {tweet.mlAnalysis.enhancementTips.map((tip, i) => (
                        <div key={i} className="flex justify-between items-center text-[10px] border-l-2 border-zinc-800 pl-3 py-1">
                            <span className="text-zinc-300">{tip.tip}</span>
                            <span className="text-green-400 font-bold">{tip.impact}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      )}

      {!isOriginal && tweet.imagePrompt && (
        <div className="mb-8 bg-black/60 border border-purple-500/30 p-4 rounded-sm group/prompt relative overflow-hidden">
            <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] text-purple-400 uppercase font-bold tracking-[0.2em]">// {currentLabels.imagePrompt}</span>
                <button onClick={() => copyToClipboard(tweet.imagePrompt!)} className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/40 px-3 py-1 hover:bg-purple-500/40 transition-all font-mono">{currentLabels.copyPrompt}</button>
            </div>
            <p className="text-xs text-purple-200/70 font-mono italic leading-relaxed">{tweet.imagePrompt}</p>
        </div>
      )}

      {tweet.postingStrategy && (
           <div className={`border ${colors.border} border-opacity-20 bg-black/40 p-4 mb-6`}>
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
                  <span className={`block ${colors.text} uppercase text-[10px] font-black tracking-widest`}>{currentLabels.powerHour}</span>
                  <div className="flex items-center gap-2 text-white font-mono text-sm">
                      <span className="text-matrix-dim text-xs font-bold mr-2">{tweet.postingStrategy.geoContext}</span>
                      <span className={`bg-black px-3 py-1 border-2 ${colors.border} text-white font-bold`}>{tweet.postingStrategy.bestDay}</span>
                      <span className="text-zinc-600 font-black">@</span>
                      <span className={`bg-black px-3 py-1 border-2 ${colors.border} text-white font-bold`}>{tweet.postingStrategy.bestTime}</span>
                  </div>
              </div>
              <p className="mt-3 text-xs text-zinc-500 italic border-l-2 border-zinc-700 pl-4 py-1">"{tweet.postingStrategy.reasoning}"</p>
           </div>
      )}

      <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 text-[11px] font-mono text-zinc-500 bg-black/60 p-5 border ${isOriginal ? 'border-zinc-800' : colors.border} border-opacity-20`}>
          <div>
              <span className={`block ${colors.text} uppercase font-bold mb-2 tracking-widest`}>{currentLabels.logicTrace}</span>
              <p className="text-zinc-400 leading-relaxed italic">{tweet.explanation}</p>
          </div>
          <div>
              <span className={`block ${colors.text} uppercase font-bold mb-2 tracking-widest`}>{currentLabels.predictedVectors}</span>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <div className="flex justify-between border-b border-zinc-800 pb-1"><span>P(fav):</span> <span className="text-white font-bold">{tweet.predictedMetrics.pLike}</span></div>
                  <div className="flex justify-between border-b border-zinc-800 pb-1"><span>P(reply):</span> <span className="text-white font-bold">{tweet.predictedMetrics.pReply}</span></div>
                  <div className="flex justify-between border-b border-zinc-800 pb-1"><span>P(repost):</span> <span className="text-white font-bold">{tweet.predictedMetrics.pRepost}</span></div>
                  <div className="flex justify-between border-b border-zinc-800 pb-1"><span>P(dwell):</span> <span className="text-white font-bold">{tweet.predictedMetrics.pDwell}</span></div>
                  <div className="flex justify-between border-b border-zinc-800 pb-1"><span>P(click):</span> <span className="text-white font-bold">{tweet.predictedMetrics.pClick || '—'}</span></div>
                  <div className="flex justify-between border-b border-zinc-800 pb-1"><span>P(share):</span> <span className="text-white font-bold">{tweet.predictedMetrics.pShare || '—'}</span></div>
                  <div className="flex justify-between border-b border-zinc-800 pb-1"><span>P(follow):</span> <span className="text-white font-bold">{tweet.predictedMetrics.pFollow || '—'}</span></div>
                  <div className="flex justify-between pb-1"><span className="text-red-400">P(neg):</span> <span className="text-red-400 font-bold">{tweet.predictedMetrics.pNegative || '0.00'}</span></div>
              </div>
          </div>
      </div>
      
      {!isOriginal && (
        <button onClick={() => tweet.thread && tweet.thread.length > 0 ? copyThread() : copyToClipboard(tweet.content)} className={`w-full mt-6 border-2 ${colors.border} bg-transparent hover:bg-white hover:text-black text-white py-3 text-xs uppercase tracking-[0.25em] transition-all font-black`}>
            {tweet.thread && tweet.thread.length > 0 ? currentLabels.copyThread : currentLabels.copy}
        </button>
      )}
    </div>
  );
};

export default ResultCard;
