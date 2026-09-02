import React from 'react';
import { useSatQuery } from '../context/SatQueryContext';
import { 
  Sliders, 
  Activity, 
  Flame, 
  Droplets, 
  Trees, 
  Building2, 
  Eye, 
  Radio, 
  Sparkles
} from 'lucide-react';

export const SpectralTools: React.FC = () => {
  const {
    activeLayer,
    setActiveLayer,
    activeIndex,
    setActiveIndex,
    indicesList,
    sarBlend,
    setSarBlend
  } = useSatQuery();

  const currentIndexData = indicesList.find(idx => idx.id === activeIndex) || indicesList[0];

  const getIndexIcon = (id: string) => {
    switch (id) {
      case 'NDVI': return <Trees className="w-3.5 h-3.5 text-emerald-400" />;
      case 'NDWI': return <Droplets className="w-3.5 h-3.5 text-cyan-400" />;
      case 'NDBI': return <Building2 className="w-3.5 h-3.5 text-amber-400" />;
      case 'BAI': return <Flame className="w-3.5 h-3.5 text-rose-400" />;
      case 'NDRE': return <Activity className="w-3.5 h-3.5 text-lime-400" />;
      default: return <Sparkles className="w-3.5 h-3.5 text-cyan-400" />;
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-4 border border-cyan-500/20 shadow-xl space-y-4 select-none">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">
            Spectral Band Math & Sensor Engine
          </h3>
        </div>
        <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">
          GPU Shaders Active
        </span>
      </div>

      <div>
        <div className="text-[11px] font-mono text-slate-400 mb-2">SENSOR COMPOSITE MODE:</div>
        <div className="grid grid-cols-4 gap-1.5">
          <button
            onClick={() => setActiveLayer('optical')}
            className={`px-2.5 py-2 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
              activeLayer === 'optical'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30 scale-[1.02]'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="text-[10px]">True Color</span>
          </button>

          <button
            onClick={() => setActiveLayer('fcc')}
            className={`px-2.5 py-2 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
              activeLayer === 'fcc'
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 scale-[1.02]'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-[10px]">FCC (NIR)</span>
          </button>

          <button
            onClick={() => setActiveLayer('sar')}
            className={`px-2.5 py-2 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
              activeLayer === 'sar'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30 scale-[1.02]'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span className="text-[10px]">SAR Radar</span>
          </button>

          <button
            onClick={() => setActiveLayer('band_math')}
            className={`px-2.5 py-2 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
              activeLayer === 'band_math'
                ? 'bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 shadow-lg shadow-orange-500/30 scale-[1.02]'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span className="text-[10px]">Band Math</span>
          </button>
        </div>
      </div>

      {activeLayer === 'band_math' && (
        <div className="space-y-3 pt-2 border-t border-slate-800 animate-in fade-in duration-200">
          <div className="text-[11px] font-mono text-slate-400">SELECT RASTER INDEX:</div>
          <div className="flex flex-wrap gap-1.5">
            {indicesList.map(idx => (
              <button
                key={idx.id}
                onClick={() => setActiveIndex(idx.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                  activeIndex === idx.id
                    ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/10'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 border border-slate-800'
                }`}
              >
                {getIndexIcon(idx.id)}
                <span>{idx.id}</span>
              </button>
            ))}
          </div>

          {currentIndexData && (
            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-heading font-bold text-xs text-white">{currentIndexData.name}</span>
                <span className="font-mono text-[10px] text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800">
                  {currentIndexData.formula}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-tight">{currentIndexData.description}</p>
              
              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between text-[9px] font-mono text-slate-400">
                  <span>{currentIndexData.labels[0]}</span>
                  <span>{currentIndexData.labels[currentIndexData.labels.length - 1]}</span>
                </div>
                <div
                  className="h-2.5 rounded-full w-full shadow-inner"
                  style={{
                    background: `linear-gradient(to right, ${currentIndexData.color_ramp.join(', ')})`
                  }}
                />
              </div>

              <div className="pt-1">
                <div className="text-[9px] font-mono text-slate-500 mb-1 flex items-center justify-between">
                  <span>PIXEL INTENSITY HISTOGRAM</span>
                  <span className="text-cyan-400">Mean: {currentIndexData.mean_value}</span>
                </div>
                <div className="flex items-end gap-1 h-8 bg-slate-900/60 p-1 rounded">
                  {currentIndexData.histogram.map((val, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-cyan-500/60 hover:bg-cyan-400 rounded-t transition-all"
                      style={{ height: `${(val / 240) * 100}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeLayer === 'sar' && (
        <div className="space-y-3 pt-2 border-t border-slate-800 animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300">Optical / SAR Fusion Blend:</span>
            <span className="text-emerald-400 font-bold">{sarBlend}% SAR</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={sarBlend}
            onChange={e => setSarBlend(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>0% (Full Optical)</span>
            <span>50% (Dual Fusion)</span>
            <span>100% (Pure Radar C-band)</span>
          </div>

          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 space-y-1">
            <div className="text-emerald-400 font-bold">Cloud Penetration Status: ACTIVE</div>
            <div className="text-slate-400 text-[10px]">
              RISAT-1A C-band (5.35 GHz) VV/VH dual-pol speckle filtered via Lee 7x7 algorithm.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
