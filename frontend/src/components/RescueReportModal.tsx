import React from 'react';
import { useSatQuery } from '../context/SatQueryContext';
import { 
  X, 
  Printer, 
  ShieldAlert, 
  CheckCircle2, 
  MapPin, 
  Building2, 
  Navigation,
  Radio
} from 'lucide-react';

export const RescueReportModal: React.FC = () => {
  const { isReportOpen, setIsReportOpen, activeReport } = useSatQuery();

  if (!isReportOpen || !activeReport) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#0b1322] border border-cyan-500/40 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-slate-200">
        
        {/* Header Bar */}
        <div className="px-6 py-4 bg-slate-950/90 border-b border-cyan-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-wide">
                  {activeReport.title}
                </h2>
                <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 font-mono text-[10px] font-bold border border-red-500/40">
                  {activeReport.severity_summary.overall_status}
                </span>
              </div>
              <p className="text-xs font-mono text-slate-400 flex items-center gap-2">
                <span>ID: {activeReport.report_id}</span>
                <span>•</span>
                <span>Generated: {activeReport.timestamp}</span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold">Ready in {activeReport.generation_latency_seconds}s</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-mono flex items-center gap-1.5 transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={() => setIsReportOpen(false)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm font-sans bg-slate-950/40">
          
          {/* Executive Operational Briefing */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/80">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300 mb-2 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-cyan-400" />
              <span>Operational Incident Briefing</span>
            </h3>
            <p className="text-slate-200 leading-relaxed text-sm">
              {activeReport.executive_briefing}
            </p>
          </div>

          {/* Severity & Footprint Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
            <div className="p-3.5 rounded-xl bg-red-950/30 border border-red-500/30">
              <span className="text-[11px] text-red-300 uppercase block">Critical Hazard Area</span>
              <span className="text-xl font-bold text-red-200">
                {activeReport.severity_summary.critical_hazard_area_km2} km²
              </span>
              <span className="text-[10px] text-red-400 block mt-0.5">U-Net Segmented Footprint</span>
            </div>
            <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30">
              <span className="text-[11px] text-amber-300 uppercase block">Severed Road Arteries</span>
              <span className="text-xl font-bold text-amber-200">
                {activeReport.blocked_infrastructure.length} Collapsed Segments
              </span>
              <span className="text-[10px] text-amber-400 block mt-0.5">OSM Verified Lifeline Cuts</span>
            </div>
            <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
              <span className="text-[11px] text-emerald-300 uppercase block">Safe Heli-Staging Bases</span>
              <span className="text-xl font-bold text-emerald-200">
                {activeReport.safe_staging_zones.length} Active Helipads
              </span>
              <span className="text-[10px] text-emerald-400 block mt-0.5">Air-Bridge Ready</span>
            </div>
          </div>

          {/* Blocked Routes & Bridges Table */}
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300 mb-2.5 flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-amber-400" />
              <span>Severed Infrastructure & Bypass Routes</span>
            </h3>
            <div className="space-y-2">
              {activeReport.blocked_infrastructure.map((route, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-900/60 border border-amber-500/20 flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{route.name}</span>
                    <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 font-mono text-[10px] font-bold">
                      {route.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">{route.impact}</p>
                  {route.bypass_route && (
                    <p className="text-xs text-emerald-300 font-mono mt-1 bg-emerald-950/30 p-2 rounded-lg border border-emerald-500/20">
                      <strong>Tactical Bypass / Engineering Action:</strong> {route.bypass_route}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Nearest Hospitals & Helipads */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300 mb-2 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Designated Casualty Triage Centers</span>
              </h3>
              <div className="space-y-2">
                {activeReport.designated_hospitals.map((hosp, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-cyan-500/20 text-xs">
                    <div className="flex items-center justify-between font-bold text-white mb-1">
                      <span>{hosp.name}</span>
                      <span className="text-cyan-300 font-mono">{hosp.distance_km} km</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-300 font-mono text-[11px]">
                      <span>Beds: {hosp.beds_available} ready</span>
                      <span>•</span>
                      <span className={hosp.helipad_ready ? "text-emerald-400" : "text-slate-400"}>
                        {hosp.helipad_ready ? "✓ Helipad Active" : "No Helipad"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-300 mb-2 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Primary Helicopter Staging Base</span>
              </h3>
              <div className="space-y-2">
                {activeReport.safe_staging_zones.map((zone, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-emerald-500/20 text-xs">
                    <div className="font-bold text-white mb-1">{zone.name}</div>
                    <p className="text-slate-300 font-mono text-[11px] mb-1">Capacity: {zone.capacity}</p>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px]">
                      Elevation: {zone.elevation_msl} (Zero Flood Risk)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Immediate Action Directives */}
          <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300 mb-2.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>Commanding Officer Directives (NDRF Standard Operating Procedure)</span>
            </h3>
            <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-200">
              {activeReport.action_directives.map((dir, idx) => (
                <li key={idx} className="leading-relaxed">
                  <span className="text-white font-medium">{dir}</span>
                </li>
              ))}
            </ol>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
          <span>Authority: National Disaster Response Force (NDRF) / SDMA</span>
          <button
            onClick={() => setIsReportOpen(false)}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-all"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
