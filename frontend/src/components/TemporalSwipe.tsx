import React from 'react';
import { useSatQuery } from '../context/SatQueryContext';
import { ArrowRightLeft, Calendar, X } from 'lucide-react';

export const TemporalSwipe: React.FC = () => {
  const {
    temporalSwipeActive,
    setTemporalSwipeActive,
    swipePosition,
    setSwipePosition,
    activeScenario
  } = useSatQuery();

  if (!temporalSwipeActive || !activeScenario) return null;

  return (
    <div className="fixed inset-x-4 bottom-4 lg:left-12 lg:right-[460px] z-30 glass-panel-accent rounded-2xl p-4 border border-amber-500/40 shadow-2xl animate-in slide-in-from-bottom-4 duration-200 select-none bg-[#0b1322]/95 backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
            <ArrowRightLeft className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">
                Pre vs Post Disaster Split-Swipe
              </h3>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-1.5 py-0.2 rounded border border-amber-800">
                {activeScenario.title}
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-400">
              Pre: {activeScenario.layers.pre_event_date} ⟷ Post: {activeScenario.layers.post_event_date}
            </p>
          </div>
        </div>

        <button
          onClick={() => setTemporalSwipeActive(false)}
          className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center justify-between text-xs font-mono text-slate-300">
          <span className="flex items-center gap-1.5 text-cyan-300 font-bold">
            <Calendar className="w-3.5 h-3.5" />
            <span>PRE: {activeScenario.layers.pre_event_date}</span>
          </span>
          <span className="text-amber-400 font-bold">SPLIT CURTAIN: {swipePosition}%</span>
          <span className="flex items-center gap-1.5 text-rose-400 font-bold">
            <Calendar className="w-3.5 h-3.5" />
            <span>POST: {activeScenario.layers.post_event_date}</span>
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={swipePosition}
          onChange={(e) => setSwipePosition(Number(e.target.value))}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs font-mono bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
        <div>
          <span className="text-slate-400 block text-[10px]">Pre-Disaster Baseline:</span>
          <span className="text-cyan-300 font-semibold">Intact River Bridge & Agriculture</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px]">Post-Disaster Impact:</span>
          <span className="text-rose-400 font-semibold">Bridge Severed + 2.14 km² Debris Scarp</span>
        </div>
      </div>
    </div>
  );
};
