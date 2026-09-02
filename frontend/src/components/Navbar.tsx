import React, { useState } from 'react';
import { useSatQuery } from '../context/SatQueryContext';
import { 
  Satellite, 
  Layers, 
  FileText, 
  Radio, 
  ChevronDown, 
  Compass, 
  Sun, 
  Key
} from 'lucide-react';

export const Navbar: React.FC<{ onOpenApiKeyModal?: () => void }> = ({ onOpenApiKeyModal }) => {
  const { 
    scenarios, 
    activeScenario, 
    setActiveScenario, 
    generateDossier,
    temporalSwipeActive,
    setTemporalSwipeActive,
    cursorTelemetry
  } = useSatQuery();

  const [isScenarioDropdownOpen, setIsScenarioDropdownOpen] = useState(false);

  return (
    <header className="h-14 bg-[#070e1b]/95 backdrop-blur-xl border-b border-cyan-500/25 px-4 flex items-center justify-between z-40 relative select-none shrink-0">
      {/* Brand & Mission Identification */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="relative">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-orange-600 via-amber-500 to-cyan-400 p-[1px] shadow-md shadow-orange-500/20">
              <div className="w-full h-full bg-[#060b13] rounded-[7px] flex items-center justify-center">
                <Satellite className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <h1 className="font-heading font-extrabold text-base tracking-wider text-white flex items-center gap-1 whitespace-nowrap">
              <span>SATQUERY</span>
              <span className="text-cyan-400">AI</span>
            </h1>
            <span className="hidden sm:inline-block text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-orange-500/20 border border-orange-500/40 text-orange-400 whitespace-nowrap">
              SIH 26167
            </span>
          </div>
        </div>

        <div className="h-5 w-px bg-slate-800 hidden md:block shrink-0" />

        {/* Mission Scenario Dropdown Selector */}
        <div className="relative shrink-0">
          <button
            onClick={() => setIsScenarioDropdownOpen(!isScenarioDropdownOpen)}
            className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-900/90 border border-cyan-500/30 hover:border-cyan-400 text-xs font-medium text-slate-200 hover:text-white transition-all shadow-inner hover:shadow-cyan-500/10"
          >
            <Radio className="w-3 h-3 text-cyan-400 shrink-0" />
            <span className="max-w-[140px] sm:max-w-[200px] md:max-w-[240px] truncate text-left">
              {activeScenario?.title || 'Select Mission'}
            </span>
            <ChevronDown className={`w-3 h-3 text-slate-400 shrink-0 transition-transform ${isScenarioDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isScenarioDropdownOpen && (
            <div className="absolute top-full left-0 mt-1.5 w-80 glass-dropdown rounded-xl py-1.5 z-50 shadow-2xl border border-cyan-500/30 divide-y divide-slate-800/80 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1 text-[9px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                Preset Indian Earth Observation Missions
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
                      {s.resolution}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">{s.region}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Orbit Telemetry Readout */}
      <div className="hidden xl:flex items-center gap-4 text-[11px] font-mono text-slate-300 bg-slate-950/70 px-3 py-1 rounded-lg border border-slate-800 shrink-0">
        <div className="flex items-center gap-1 text-cyan-300">
          <Compass className="w-3 h-3 text-cyan-400 shrink-0" />
          <span>LAT: {cursorTelemetry.lat.toFixed(4)}°</span>
          <span className="text-slate-700">|</span>
          <span>LON: {cursorTelemetry.lng.toFixed(4)}°</span>
        </div>
        <div className="flex items-center gap-1 text-amber-300">
          <Sun className="w-3 h-3 text-amber-400 shrink-0" />
          <span>SUN EL: {activeScenario?.sun_elevation || '58.4°'}</span>
        </div>
        <div className="flex items-center gap-1 text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
          <span>PASS: DESC-89A</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Temporal Swipe Toggle */}
        <button
          onClick={() => setTemporalSwipeActive(!temporalSwipeActive)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
            temporalSwipeActive 
              ? 'bg-amber-500/20 border border-amber-400 text-amber-300 shadow-md shadow-amber-500/20' 
              : 'bg-slate-900/90 border border-slate-700/60 text-slate-300 hover:border-slate-500'
          }`}
          title="Toggle Bitemporal Split-Curtain Change Detection"
        >
          <Layers className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Temporal Swipe</span>
        </button>

        {/* Live LLM Key Settings */}
        {onOpenApiKeyModal && (
          <button
            onClick={onOpenApiKeyModal}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-cyan-950/40 border border-cyan-500/30 hover:border-cyan-400 text-xs font-medium text-cyan-300 transition-all"
            title="Connect Live Gemini / OpenAI API Key"
          >
            <Key className="w-3 h-3 text-cyan-400" />
            <span className="hidden sm:inline font-mono text-[11px]">Live AI Key</span>
          </button>
        )}

        {/* Generate ISRO SitRep Dossier Button */}
        <button
          onClick={generateDossier}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-medium text-xs shadow-md shadow-orange-600/30 border border-orange-400/40 transition-all active:scale-95 whitespace-nowrap"
        >
          <FileText className="w-3.5 h-3.5" />
          <span className="font-semibold tracking-wide">ISRO SitRep Dossier</span>
        </button>
      </div>
    </header>
  );
};
