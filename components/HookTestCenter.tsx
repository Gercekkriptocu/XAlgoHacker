
import React from 'react';
import { HookTest, Language } from '../types';

interface HookTestCenterProps {
  hooks: HookTest[];
  language: Language;
}

const HookTestCenter: React.FC<HookTestCenterProps> = ({ hooks, language }) => {
  const labels = {
    EN: { title: "HOOK_TEST_ARENA // ALTERNATIVE_TRIGGERS", why: "WHY IT WORKS?" },
    TR: { title: "KANCA_TEST_ARENASI // ALTERNATİF_TETİKLEYİCİLER", why: "NEDEN İŞE YARAR?" }
  };

  const t = labels[language];

  return (
    <div className="bg-zinc-950 border border-matrix-dim/30 p-6 my-10 overflow-hidden relative">
      <div className="absolute top-0 right-0 p-2 text-[8px] text-matrix-dim font-black opacity-30 select-none">
        SIMULATION_ACTIVE_RUN_ID_442
      </div>
      <h4 className="text-matrix-green text-[10px] font-black tracking-[0.4em] uppercase mb-8 flex items-center gap-3">
        <span className="w-1.5 h-1.5 bg-matrix-green rounded-full animate-ping"></span>
        {t.title}
      </h4>
      <div className="space-y-4">
        {hooks.map((h, i) => (
          <div key={i} className="group border border-zinc-900 hover:border-matrix-green/40 p-4 transition-all bg-black/40">
            <div className="flex gap-4 items-start">
               <span className="text-matrix-dim font-mono text-xs pt-1">0{i+1}.</span>
               <div className="flex-1">
                 <p className="text-white text-sm font-bold mb-2 group-hover:text-matrix-green transition-colors leading-relaxed">"{h.hook}"</p>
                 <div className="flex items-center gap-2 mt-3 pt-2 border-t border-zinc-800">
                    <span className="text-[9px] text-zinc-500 font-bold uppercase">{t.why}:</span>
                    <span className="text-[10px] text-matrix-dim italic">{h.reasoning}</span>
                 </div>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HookTestCenter;
