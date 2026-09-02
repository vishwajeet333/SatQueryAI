import React from 'react';
import { useSatQuery } from '../context/SatQueryContext';
import { ArrowRightLeft, Calendar, X } from 'lucide-react';

export const TemporalSwipe: React.FC = () => {
  const {
    temporalSwipeActive,
    setTemporalSwipeActive,
    swipePosition,
    setSwipePosition,
    temporalData,
    activeScenario
  } = useSatQuery();

  if (!temporalSwipeActive || !activeScenario) return null;

  return (
    <div className="fixed inset-x-4 bottom-4 lg:left-80 lg:right-96 z-30 glass-panel-accent rounded-2xl p-4 border border-amber-500/40 shadow-2xl animate-in slide-in-from-bottom-4 duration-200 select-none">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
            <ArrowRightLeft className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">
                Bitemporal Change & Damage Assessment
              </h3>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-1.5 py-0.2 rounded border border-amber-800">
                {temporalData?.event_type || 'Disaster Event'}
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-400">
              Comparing {activeScenario.layers.pre_event_date} (Pre) ⟷ {activeScenario.layers.post_event_date} (Post)
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
            <span>PRE-EVENT: {activeScenario.layers.pre_event_date}</span>
          </span>
          <span className="text-amber-400 font-bold">SPLIT CURTAIN: {swipePosition}%</span>
          <span className="flex items-center gap-1.5 text-rose-400 font-bold">
            <Calendar className="w-3.5 h-3.5" />
            <span>POST-EVENT: {activeScenario.layers.post_event_date}</span>
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={swipePosition}
          onChange={e => setSwipePosition(Number(e.target.value))}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400 shadow-inner"
        />
      </div>

      {temporalData && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <div className="text-[10px] font-mono text-slate-500">DAMAGE SEVERITY</div>
            <div className="text-xs font-bold text-rose-400">{temporalData.overall_damage_severity}</div>
          </div>
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <div className="text-[10px] font-mono text-slate-500">DISPLACED AREA</div>
            <div className="text-xs font-bold text-amber-300">{temporalData.area_displaced_km2} km²</div>
          </div>
          {Object.entries(temporalData.metrics).slice(0, 2).map(([k, v]) => (
            <div key={k} className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
              <div className="text-[10px] font-mono text-slate-500 uppercase truncate">
                {k.replace(/_/g, ' ')}
              </div>
              <div className="text-xs font-bold text-cyan-300 truncate">{String(v)}</div>
            </div>
          ))}
        </div>
      )}

      {temporalData?.land_cover_transition && (
        <div className="space-y-1.5">
          <div className="text-[10px] font-mono text-slate-400">LAND COVER TRANSITION MATRIX:</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-24 overflow-y-auto pr-1">
            {temporalData.land_cover_transition.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-900/90 p-2 rounded-lg border border-slate-800 text-[10px] flex items-center justify-between gap-2"
              >
                <div className="truncate">
                  <span className="text-slate-400">{item.from_class}</span>
                  <span className="text-amber-400 mx-1">➜</span>
                  <span className="text-slate-200 font-semibold">{item.to_class}</span>
                </div>
                <div className="font-mono text-cyan-300 font-bold shrink-0">
                  {item.pct} <span className="text-[9px] text-slate-500">({item.area_ha}ha)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
