import React, { useState } from 'react';
import { useSatQuery } from '../context/SatQueryContext';
import { 
  ChevronDown, 
  Shield, 
  SplitSquareVertical, 
  Cpu,
  Layers
} from 'lucide-react';
import type { Language } from '../types';

export const Navbar: React.FC = () => {
  const { 
    scenarios, 
    activeScenario, 
    setActiveScenario, 
    language,
    setLanguage,
    isOfflineMode,
    setIsOfflineMode,
    temporalSwipeActive,
    setTemporalSwipeActive,
    activeLayer,
    setActiveLayer
  } = useSatQuery();

  const [isScenarioDropdownOpen, setIsScenarioDropdownOpen] = useState(false);

  const languages: { id: Language; label: string }[] = [
    { id: 'en', label: 'English' },
    { id: 'hi', label: 'हिन्दी' },
    { id: 'ml', label: 'മലയാളം' }
  ];

  return (
    <header className="h-14 bg-[#070e1b]/95 backdrop-blur-xl border-b border-cyan-500/25 px-4 flex items-center justify-between z-40 relative select-none shrink-0">
      {/* Brand & Disaster Mission Selector */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="relative">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-red-600 via-orange-500 to-cyan-400 p-[1px] shadow-md shadow-orange-500/20">
              <div className="w-full h-full bg-[#060b13] rounded-[7px] flex items-center justify-center">
                <Shield className="w-4 h-4 text-orange-400" />
              </div>
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <h1 className="font-heading font-extrabold text-sm sm:text-base tracking-wider text-white flex items-center gap-1 whitespace-nowrap">
              <span>SATQUERY</span>
              <span className="text-cyan-400">COPILOT</span>
            </h1>
            <span className="hidden lg:inline-block text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-orange-500/20 border border-orange-500/40 text-orange-300 whitespace-nowrap">
              NDRF / FIELD OPS
            </span>
          </div>
        </div>

        <div className="h-5 w-px bg-slate-800 hidden md:block shrink-0" />

        {/* Disaster Mission Selector */}
        <div className="relative shrink-0">
          <button
            onClick={() => setIsScenarioDropdownOpen(!isScenarioDropdownOpen)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-900/90 border border-cyan-500/30 hover:border-cyan-400 text-xs font-medium text-slate-200 hover:text-white transition-all shadow-inner"
          >
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="max-w-[130px] sm:max-w-[200px] md:max-w-[260px] truncate text-left font-semibold">
              {activeScenario?.title || 'Select Disaster Mission'}
            </span>
            <ChevronDown className={`w-3 h-3 text-slate-400 shrink-0 transition-transform ${isScenarioDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isScenarioDropdownOpen && (
            <div className="absolute top-full left-0 mt-1.5 w-84 glass-dropdown rounded-xl py-1.5 z-50 shadow-2xl border border-cyan-500/30 divide-y divide-slate-800/80 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1 text-[9px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                Active Indian Disaster Operations
              </div>
              {scenarios.map(s => (
                <button
                  key={s.id}
                  onClick={() => {
                    setActiveScenario(s);
                    setIsScenarioDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 hover:bg-cyan-500/10 flex flex-col gap-0.5 transition-colors ${
                    activeScenario?.id === s.id ? 'bg-cyan-500/15 border-l-2 border-cyan-400' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-200 truncate pr-2">{s.title}</span>
                    <span className="text-[9px] font-mono text-cyan-400 bg-cyan-950/60 px-1 py-0.2 rounded border border-cyan-800/40 shrink-0">
                      {s.primary_sensor.split('+')[0]}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">{s.region}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Controls: Language Toggle, Edge AI Mode, Tools */}
      <div className="flex items-center gap-2.5 shrink-0">
        
        {/* Multilingual Selector (EN / हिन्दी / മലയാളം) */}
        <div className="flex items-center bg-slate-900/90 rounded-lg p-0.5 border border-slate-700/80">
          {languages.map(lang => (
            <button
              key={lang.id}
              onClick={() => setLanguage(lang.id)}
              className={`px-2 py-1 rounded-md text-[11px] font-medium transition-all ${
                language === lang.id
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>

        {/* Edge / Offline AI Badge (SIH 2026 Innovation Flag) */}
        <div 
          onClick={() => setIsOfflineMode(!isOfflineMode)}
          className="cursor-pointer hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-[11px] font-mono"
          title="Trained U-Net model running on-device with zero cloud latency"
        >
          <Cpu className="w-3.5 h-3.5 text-emerald-400" />
          <span>Edge U-Net: <strong className="text-white">Active</strong></span>
        </div>

        {/* Before/After Split Curtain Toggle */}
        <button
          onClick={() => setTemporalSwipeActive(!temporalSwipeActive)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-mono transition-all ${
            temporalSwipeActive 
              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' 
              : 'bg-slate-900/60 border-slate-700 text-slate-300 hover:text-white'
          }`}
          title="Toggle Pre/Post Disaster Slider"
        >
          <SplitSquareVertical className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Pre/Post Slider</span>
        </button>

        {/* SAR Cloud Penetration Toggle */}
        <button
          onClick={() => setActiveLayer(activeLayer === 'sar' ? 'optical' : 'sar')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-mono transition-all ${
            activeLayer === 'sar' 
              ? 'bg-indigo-500/25 border-indigo-400 text-indigo-300' 
              : 'bg-slate-900/60 border-slate-700 text-slate-300 hover:text-white'
          }`}
          title="Toggle SAR Radar Cloud Penetration"
        >
          <Layers className="w-3.5 h-3.5" />
          <span className="hidden md:inline">SAR Radar</span>
        </button>

      </div>
    </header>
  );
};
