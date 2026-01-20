import React from 'react';

const TRENDS = [
  "DETECTED_SIGNAL: #AI_REVOLUTION",
  "PHOENIX_VECTOR: HIGH_VOLATILITY",
  "THUNDER_NODE: ACTIVE",
  "GROK_WEIGHTS: UPDATED 2MS AGO",
  "TOPIC: CRYPTO_CRASH",
  "TOPIC: FUTURE_TECH",
  "ALGO_BIAS: VIDEO_NATIVE",
  "CLUSTER_ID: 8842_ALPHA"
];

const TrendTicker: React.FC = () => {
  return (
    <div className="w-full bg-black border-y border-matrix-darkGreen overflow-hidden py-1 mb-4 relative z-20">
      <div className="whitespace-nowrap animate-marquee flex space-x-8">
        {/* Duplicated list for seamless loop */}
        {[...TRENDS, ...TRENDS, ...TRENDS].map((trend, i) => (
          <span key={i} className="text-xs text-matrix-dim font-mono uppercase tracking-widest">
            {trend}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TrendTicker;