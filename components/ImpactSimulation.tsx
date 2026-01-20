
import React, { useEffect, useState } from 'react';
import { OptimizedTweet, Language } from '../types';

interface ImpactSimulationProps {
  original: OptimizedTweet;
  optimized: OptimizedTweet;
  language: Language;
}

const ImpactSimulation: React.FC<ImpactSimulationProps> = ({ original, optimized, language }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(1), 300);
    return () => clearTimeout(timer);
  }, []);

  const labels = {
    EN: {
      title: "A/B SIMULATION ARENA",
      virality: "VIRALITY PROBABILITY",
      readability: "READABILITY / HOOK",
      lift: "ESTIMATED LIFT",
      original: "ORIGINAL PAYLOAD",
      optimized: "HACKER OUTPUT"
    },
    TR: {
      title: "A/B SİMÜLASYON ARENASI",
      virality: "VİRAL OLMA OLASILIĞI",
      readability: "OKUNABİLİRLİK / KANCA",
      lift: "TAHMİNİ ARTIŞ",
      original: "ORİJİNAL VERİ",
      optimized: "HACKER ÇIKTISI"
    }
  };

  const t = labels[language];

  const parseMetric = (val: string) => {
    if (!val) return 50;
    const v = val.toLowerCase();
    if (v.includes('high') || v.includes('yüksek') || v.includes('strong') || v.includes('80') || v.includes('90')) return 88;
    if (v.includes('med') || v.includes('orta') || v.includes('moderate') || v.includes('60')) return 62;
    if (v.includes('low') || v.includes('düşük') || v.includes('weak') || v.includes('30')) return 35;
    return 50;
  };

  const improvement = original.score > 0 ? ((optimized.score - original.score) / original.score) * 100 : 0;

  const renderBar = (label: string, val1: number, val2: number) => (
    <div className="mb-6">
      <div className="flex justify-between text-[10px] uppercase text-matrix-dim mb-1 font-bold tracking-widest">
        <span>{label}</span>
      </div>
      <div className="relative h-4 bg-zinc-900/50 border border-zinc-800 overflow-hidden">
        {/* Original Marker */}
        <div 
            className="absolute top-0 bottom-0 left-0 bg-zinc-600/40 transition-all duration-700 ease-out"
            style={{ width: `${progress * val1}%` }}
        ></div>
        
        {/* Optimized Marker */}
        <div 
            className="absolute top-0 bottom-0 left-0 bg-matrix-green/30 border-r-2 border-matrix-green shadow-[0_0_10px_rgba(0,255,65,0.4)] transition-all duration-700 ease-out delay-150"
            style={{ width: `${progress * val2}%` }}
        ></div>
      </div>
      <div className="flex justify-between text-[9px] mt-1 font-mono">
        <span className="text-zinc-500">ORIGINAL: {val1}%</span>
        <span className="text-matrix-green">HACKED: {val2}%</span>
      </div>
    </div>
  );

  return (
    <div className="bg-black/90 border border-matrix-darkGreen p-6 mb-12 relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-matrix-green/30 to-transparent"></div>
        
        <h3 className="text-matrix-green font-bold text-xs tracking-[0.4em] mb-8 text-center border-b border-matrix-darkGreen pb-3">
            {t.title}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
           <div className="p-4 bg-zinc-950 border border-zinc-800/50">
              <div className="text-[10px] text-zinc-500 font-bold mb-2 uppercase tracking-widest">{t.original}</div>
              <div className="text-zinc-500 text-xs italic leading-relaxed font-mono">"{original.content}"</div>
           </div>
           <div className="p-4 bg-black border border-matrix-green/30 relative">
              <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-matrix-green animate-pulse rounded-full"></div>
              <div className="text-[10px] text-matrix-green font-bold mb-2 uppercase tracking-widest">{t.optimized}</div>
              <div className="text-white text-xs leading-relaxed font-mono">"{optimized.content}"</div>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-2 space-y-2">
                {renderBar(t.virality, original.score, optimized.score)}
                {renderBar(t.readability, parseMetric(original.predictedMetrics.pDwell), parseMetric(optimized.predictedMetrics.pDwell))}
            </div>
            
            <div className="flex flex-col justify-center items-center p-6 border border-matrix-darkGreen/50 bg-matrix-darkGreen/5">
                <span className="text-matrix-dim text-[10px] uppercase mb-1 tracking-widest font-bold">{t.lift}</span>
                <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black text-white">+{Math.max(0, improvement).toFixed(0)}</span>
                    <span className="text-xl text-matrix-green">%</span>
                </div>
                <div className="w-full h-0.5 bg-zinc-800 mt-4 relative">
                    <div className="h-full bg-matrix-green shadow-[0_0_10px_rgba(0,255,65,1)]" style={{ width: '100%' }}></div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default ImpactSimulation;
