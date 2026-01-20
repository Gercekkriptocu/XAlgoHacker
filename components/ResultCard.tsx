import React from 'react';
import { OptimizedTweet, TweetType, Language } from '../types';

interface ResultCardProps {
  tweet: OptimizedTweet;
  index: number;
  language: Language;
}

const ResultCard: React.FC<ResultCardProps> = ({ tweet, index, language }) => {
  const getBorderColor = (type: TweetType) => {
    switch (type) {
      case TweetType.ORIGINAL: return 'border-zinc-700';
      case TweetType.VIRAL_HOOK: return 'border-red-500/50';
      case TweetType.ENGAGEMENT_BAIT: return 'border-yellow-500/50';
      case TweetType.VALUE_THREAD: return 'border-blue-500/50';
      default: return 'border-matrix-green';
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
    EN: {
      logicTrace: 'Logic Trace:',
      predictedVectors: 'Predicted Vectors:',
      powerHour: 'TEMPORAL_INJECTION_WINDOW (Power Hour):',
      copy: 'Copy to Clipboard',
      score: 'SCORE'
    },
    TR: {
      logicTrace: 'Mantık İzi:',
      predictedVectors: 'Tahmin Vektörleri:',
      powerHour: 'ZAMAN ENJEKSİYON PENCERESİ (Power Hour):',
      copy: 'Panoya Kopyala',
      score: 'PUAN'
    }
  };

  const currentLabels = labels[language];
  const isOriginal = tweet.type === TweetType.ORIGINAL;

  return (
    <div 
      className={`relative group bg-zinc-900 border ${getBorderColor(tweet.type)} p-6 mb-6 transition-all duration-300 ${!isOriginal && 'hover:shadow-[0_0_20px_rgba(0,255,65,0.15)] hover:-translate-y-1'}`}
    >
        {/* Corner Accents */}
        <div className={`absolute top-0 left-0 w-2 h-2 border-t border-l ${isOriginal ? 'border-zinc-500' : 'border-matrix-green'}`}></div>
        <div className={`absolute top-0 right-0 w-2 h-2 border-t border-r ${isOriginal ? 'border-zinc-500' : 'border-matrix-green'}`}></div>
        <div className={`absolute bottom-0 left-0 w-2 h-2 border-b border-l ${isOriginal ? 'border-zinc-500' : 'border-matrix-green'}`}></div>
        <div className={`absolute bottom-0 right-0 w-2 h-2 border-b border-r ${isOriginal ? 'border-zinc-500' : 'border-matrix-green'}`}></div>

      <div className={`flex justify-between items-start mb-4 border-b ${isOriginal ? 'border-zinc-700' : 'border-matrix-darkGreen'} pb-2`}>
        <h3 className={`${isOriginal ? 'text-gray-400' : 'text-matrix-green'} font-bold text-lg tracking-wider`}>
           {isOriginal ? `// ${getTitle(tweet.type)}` : `// CANDIDATE_0${index}: ${getTitle(tweet.type)}`}
        </h3>
        <span className={`${isOriginal ? 'bg-zinc-800 text-gray-400' : 'bg-matrix-darkGreen text-matrix-green'} px-2 py-1 text-xs font-bold`}>
          {currentLabels.score}: {tweet.score.toFixed(1)}
        </span>
      </div>

      <div className="mb-6">
        <p className={`${isOriginal ? 'text-gray-300 italic' : 'text-white'} text-lg whitespace-pre-wrap font-sans leading-relaxed`}>
          {tweet.content}
        </p>
      </div>

      <div className={`space-y-4`}>
        {/* Power Hour Section */}
        {tweet.postingStrategy && (
             <div className="border border-matrix-dim/30 bg-black/40 p-3 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                    <span className="block text-matrix-dim uppercase text-xs font-bold">{currentLabels.powerHour}</span>
                    <div className="flex items-center gap-3 text-white font-mono text-sm">
                        <span className="bg-matrix-dim/20 px-2 py-0.5 border border-matrix-dim/50 rounded text-matrix-green animate-pulse">
                           {tweet.postingStrategy.bestDay}
                        </span>
                        <span className="text-gray-500">@</span>
                        <span className="bg-matrix-dim/20 px-2 py-0.5 border border-matrix-dim/50 rounded text-matrix-green font-bold">
                           {tweet.postingStrategy.bestTime}
                        </span>
                    </div>
                </div>
                <div className="text-xs text-gray-400 italic border-l-2 border-matrix-darkGreen pl-3 py-1">
                    "{tweet.postingStrategy.reasoning}"
                </div>
             </div>
        )}

        {/* Stats Grid */}
        <div className={`grid grid-cols-2 gap-4 text-xs font-mono text-gray-400 bg-black/50 p-3 border ${isOriginal ? 'border-zinc-800' : 'border-matrix-darkGreen/50'}`}>
            <div>
                <span className="block text-matrix-dim uppercase">{currentLabels.logicTrace}</span>
                <p className="text-matrix-green/80 mt-1">{tweet.explanation}</p>
            </div>
            <div>
                <span className="block text-matrix-dim uppercase mb-1">{currentLabels.predictedVectors}</span>
                <div className="grid grid-cols-2 gap-y-1">
                    <div>P(Like): <span className="text-white">{tweet.predictedMetrics.pLike}</span></div>
                    <div>P(Reply): <span className="text-white">{tweet.predictedMetrics.pReply}</span></div>
                    <div>P(Repost): <span className="text-white">{tweet.predictedMetrics.pRepost}</span></div>
                    <div>P(Dwell): <span className="text-white">{tweet.predictedMetrics.pDwell}</span></div>
                </div>
            </div>
        </div>
      </div>
      
      {!isOriginal && (
        <div className="flex gap-2 mt-4">
             <button 
                onClick={() => navigator.clipboard.writeText(tweet.content)}
                className="flex-1 border border-matrix-darkGreen hover:bg-matrix-green hover:text-black text-matrix-green py-2 text-sm uppercase tracking-widest transition-colors duration-200"
            >
                {language === 'TR' ? 'Tweet\'i Kopyala' : 'Copy Tweet'}
            </button>
        </div>
      )}
    </div>
  );
};

export default ResultCard;