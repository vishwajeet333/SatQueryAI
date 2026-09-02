import React, { useState } from 'react';
import { useSatQuery } from '../context/SatQueryContext';
import { 
  ChevronDown, 
  Shield, 
  UploadCloud, 
  Terminal, 
  Award, 
  Cpu
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
    setIsUploadOpen,
    setIsTraceOpen,
    setIsBenchmarkOpen,
    uploadedRaster
  } = useSatQuery();

  const [isScenarioDropdownOpen, setIsScenarioDropdownOpen] = useState(false);

  const languages: { id: Language; label: string }[] = [
    { id: 'en', label: 'English' },
    { id: 'hi', label: 'हिन्दी' },
    { id: 'ml', label: 'മലയാളം' }
  ];

  return (
    <header className="h-14 bg-[#070e1b]/95 backdrop-blur-xl border-b border-cyan-500/25 px-4 flex items-center justify-between z-40 relative select-none shrink-0">
      {/* Brand & Mission Selector */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="relative">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 via-blue-500 to-orange-400 p-[1px] shadow-md shadow-cyan-500/20">
              <div className="w-full h-full bg-[#060b13] rounded-[7px] flex items-center justify-center">
                <Shield className="w-4 h-4 text-cyan-400" />
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
              <span className="text-cyan-400">VLM</span>
            </h1>
            <span className="hidden xl:inline-block text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 whitespace-nowrap">
              ISRO SIH 26167
            </span>
          </div>
        </div>

        <div className="h-5 w-px bg-slate-800 hidden md:block shrink-0" />

        {/* Disaster Preset Selector */}
        <div className="relative shrink-0">
          <button
            onClick={() => setIsScenarioDropdownOpen(!isScenarioDropdownOpen)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-900/90 border border-cyan-500/30 hover:border-cyan-400 text-xs font-medium text-slate-200 hover:text-white transition-all shadow-inner"
          >
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="max-w-[120px] sm:max-w-[180px] md:max-w-[220px] truncate text-left font-semibold">
              {uploadedRaster ? `Uploaded: ${uploadedRaster.filename}` : activeScenario?.title || 'Select Mission'}
            </span>
            <ChevronDown className={`w-3 h-3 text-slate-400 shrink-0 transition-transform ${isScenarioDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isScenarioDropdownOpen && (
            <div className="absolute top-full left-0 mt-1.5 w-84 glass-dropdown rounded-xl py-1.5 z-50 shadow-2xl border border-cyan-500/30 divide-y divide-slate-800/80 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1 text-[9px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                Active Satellite Datasets & Missions
              </div>
              {scenarios.map(s => (
                <button
                  key={s.id}
                  onClick={() => {
                    setActiveScenario(s);
                    setIsScenarioDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 hover:bg-cyan-500/10 flex flex-col gap-0.5 transition-colors ${
                    activeScenario?.id === s.id && !uploadedRaster ? 'bg-cyan-500/15 border-l-2 border-cyan-400' : ''
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

      {/* Right Controls: Upload, Auditable Trace, Benchmarks, Multilingual */}
      <div className="flex items-center gap-2 shrink-0">
        
        {/* Upload Arbitrary GeoTIFF */}
        <button
          onClick={() => setIsUploadOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 text-xs font-mono transition-all shadow-sm"
        >
          <UploadCloud className="w-3.5 h-3.5" />
          <span className="hidden sm:inline font-semibold">Upload GeoTIFF</span>
        </button>

        {/* Auditable Execution Trace Trigger */}
        <button
          onClick={() => setIsTraceOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-mono transition-all"
          title="Inspect Auditable Model Execution Trace (SIH Jury Parameter)"
        >
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden md:inline">Auditable Trace</span>
        </button>

        {/* Public Benchmarks Trigger */}
        <button
          onClick={() => setIsBenchmarkOpen(true)}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-mono transition-all"
          title="Inspect VRSBench, RSVQA, CDVQA & BigEarthNet Scores"
        >
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden lg:inline">Benchmarks</span>
        </button>

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

        {/* Edge / Offline AI Badge */}
        <div 
          onClick={() => setIsOfflineMode(!isOfflineMode)}
          className="cursor-pointer hidden xl:flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono"
        >
          <Cpu className="w-3 h-3 text-emerald-400" />
          <span>BigEarthNet VLM</span>
        </div>

      </div>
    </header>
  );
};
