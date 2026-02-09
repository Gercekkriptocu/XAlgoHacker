import React, { useEffect, useState, useCallback } from 'react';
import { TrendData, TrendItem, fetchTrends, clearTrendCache } from '../services/trendService';
import { Language, AiProvider } from '../types';

interface TrendTickerProps {
  language: Language;
  apiKey?: string;
  provider?: AiProvider;
  onTrendsLoaded?: (data: TrendData) => void;
}

const StatusDot: React.FC<{ status: 'loading' | 'live' | 'offline' | 'cached' }> = ({ status }) => {
  const colors = {
    loading: 'bg-yellow-500 animate-pulse',
    live: 'bg-matrix-green animate-pulse',
    offline: 'bg-red-500',
    cached: 'bg-blue-500'
  };
  return <span className={`inline-block w-1.5 h-1.5 rounded-full ${colors[status]}`} />;
};

const TrendTicker: React.FC<TrendTickerProps> = ({ language, apiKey, provider, onTrendsLoaded }) => {
  const [trendData, setTrendData] = useState<TrendData | null>(null);
  const [status, setStatus] = useState<'loading' | 'live' | 'offline' | 'cached'>('loading');
  const [isExpanded, setIsExpanded] = useState(false);

  const loadTrends = useCallback(async () => {
    setStatus('loading');
    try {
      const data = await fetchTrends(language, apiKey, provider);
      setTrendData(data);
      
      if (data.source === 'OFFLINE_CACHE') {
        setStatus('offline');
      } else if (data.source.includes('AI')) {
        setStatus('cached');
      } else {
        setStatus('live');
      }

      if (onTrendsLoaded) {
        onTrendsLoaded(data);
      }
    } catch {
      setStatus('offline');
    }
  }, [language, apiKey, provider, onTrendsLoaded]);

  useEffect(() => {
    loadTrends();
    const interval = setInterval(loadTrends, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, [loadTrends]);

  const handleRefresh = () => {
    clearTrendCache();
    loadTrends();
  };

  const sourceLabel = trendData?.source
    ? (language === 'TR' ? `KAYNAK: ${trendData.source}` : `SOURCE: ${trendData.source}`)
    : '';

  const statusLabel = {
    loading: language === 'TR' ? 'YÜKLENİYOR...' : 'LOADING...',
    live: language === 'TR' ? 'CANLI' : 'LIVE',
    offline: language === 'TR' ? 'ÇEVRİMDIŞI' : 'OFFLINE',
    cached: language === 'TR' ? 'ÖNBELLEK' : 'CACHED'
  }[status];

  const tickerItems: string[] = trendData?.trends
    .filter(t => t.isActive && t.title !== 'Trend verisi yüklenemedi')
    .map(t => `#${t.title.replace(/\s+/g, '')} (${t.searchVolume})`) || [];

  if (tickerItems.length === 0 && status === 'loading') {
    tickerItems.push(
      language === 'TR' ? 'TREND_VERİSİ_YÜKLENİYOR...' : 'LOADING_TREND_DATA...',
      'SCANNING_TURKEY_TRENDING...',
      'CONNECTING_TO_DATA_SOURCE...'
    );
  }

  return (
    <div className="w-full mb-4 relative z-20">
      <div className="bg-black border-y border-matrix-darkGreen overflow-hidden relative group">
        {/* Status indicator */}
        <div className="absolute top-0 left-0 z-10 flex items-center gap-2 bg-black/95 border-r border-b border-matrix-darkGreen px-3 py-1">
          <StatusDot status={status} />
          <span className="text-[8px] text-matrix-dim font-bold uppercase tracking-widest">
            {language === 'TR' ? 'TR_GÜNDEM' : 'TR_TRENDS'} — {statusLabel}
          </span>
        </div>

        {/* Refresh button */}
        <button
          onClick={handleRefresh}
          className="absolute top-0 right-0 z-10 bg-black/95 border-l border-b border-matrix-darkGreen px-2 py-1 text-[8px] text-matrix-dim hover:text-matrix-green transition-colors opacity-0 group-hover:opacity-100 uppercase tracking-widest"
          aria-label={language === 'TR' ? 'Trendleri yenile' : 'Refresh trends'}
        >
          ↻ {language === 'TR' ? 'YENİLE' : 'REFRESH'}
        </button>

        {/* Scrolling marquee */}
        <div className="whitespace-nowrap animate-marquee flex space-x-8 py-1 pl-40">
          {[...tickerItems, ...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} className="text-xs text-matrix-dim font-mono uppercase tracking-widest">
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Expandable detail panel */}
      {trendData && trendData.trends.length > 0 && trendData.source !== 'OFFLINE_CACHE' && (
        <div className="border-x border-b border-matrix-darkGreen bg-black/50">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex justify-between items-center px-4 py-1.5 text-[9px] text-matrix-dim hover:text-matrix-green transition-colors uppercase tracking-widest"
          >
            <span>
              {isExpanded 
                ? (language === 'TR' ? '▲ TREND PANELİNİ KAPAT' : '▲ COLLAPSE TREND PANEL')
                : (language === 'TR' ? '▼ DETAYLI TREND ANALİZİ' : '▼ DETAILED TREND ANALYSIS')
              }
            </span>
            <span className="text-[8px] opacity-60">{sourceLabel}</span>
          </button>

          {isExpanded && (
            <div className="px-4 pb-4 grid grid-cols-1 md:grid-cols-2 gap-2">
              {trendData.trends.slice(0, 10).map((trend, idx) => (
                <TrendCard key={idx} trend={trend} index={idx} language={language} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const TrendCard: React.FC<{ trend: TrendItem; index: number; language: Language }> = ({ trend, index, language }) => {
  return (
    <div className="flex items-start gap-3 p-2 border border-zinc-900 hover:border-matrix-green/30 transition-colors bg-black/40 group/card">
      <span className="text-matrix-dim font-mono text-[10px] pt-0.5 opacity-50">
        {String(index + 1).padStart(2, '0')}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs text-white font-bold truncate group-hover/card:text-matrix-green transition-colors">
            {trend.title}
          </span>
          {trend.isActive && (
            <span className="flex-shrink-0 text-[8px] text-matrix-green bg-matrix-green/10 border border-matrix-green/20 px-1.5 py-0.5 uppercase">
              {language === 'TR' ? 'Aktif' : 'Active'}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-[9px] text-matrix-dim font-mono">
            {trend.searchVolume} {language === 'TR' ? 'arama' : 'searches'}
          </span>
          {trend.category && trend.category !== 'trending' && trend.category !== 'ai_generated' && (
            <span className="text-[8px] text-zinc-600 uppercase">[{trend.category}]</span>
          )}
        </div>
        {trend.relatedQueries && trend.relatedQueries.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {trend.relatedQueries.map((q, i) => (
              <span key={i} className="text-[8px] text-zinc-600 bg-zinc-900 px-1.5 py-0.5 truncate max-w-[150px]">
                {q}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendTicker;
