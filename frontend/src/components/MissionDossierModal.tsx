import React from 'react';
import { useSatQuery } from '../context/SatQueryContext';
import { 
  Printer, 
  X, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  MapPin
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const MissionDossierModal: React.FC = () => {
  const { isDossierOpen, setIsDossierOpen, dossierData } = useSatQuery();

  if (!isDossierOpen || !dossierData) return null;

  const handlePrint = () => {
    confetti({ particleCount: 50, spread: 70 });
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4 sm:p-6 overflow-y-auto select-text">
      <div className="bg-[#0b1322] border border-cyan-500/40 rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div className="bg-[#070d18] px-6 py-3 border-b border-cyan-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>OFFICIAL EARTH OBSERVATION SITREP BRIEF</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={() => setIsDossierOpen(false)}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6 text-slate-200 text-xs font-sans max-h-[80vh] overflow-y-auto print:max-h-none print:overflow-visible print:bg-white print:text-black">
          
          <div className="text-center border-y border-amber-500/40 py-1.5 font-mono font-bold text-[11px] text-amber-400 uppercase tracking-widest bg-amber-500/10">
            {dossierData.classification}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-lg text-white tracking-wide">
                  ISRO / NRSC
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/40">
                  DISASTER SUPPORT PROGRAMME
                </span>
              </div>
              <div className="text-xs text-slate-400 font-mono">
                {dossierData.organization}
              </div>
            </div>

            <div className="text-right font-mono text-[11px] space-y-0.5 text-slate-400">
              <div>REPORT ID: <strong className="text-cyan-300">{dossierData.report_id}</strong></div>
              <div>DATE/TIME: <strong className="text-slate-200">{dossierData.generated_timestamp}</strong></div>
              <div>NODAL AGENCY: <strong className="text-slate-200">{dossierData.signatory.nodal_agency}</strong></div>
            </div>
          </div>

          <div className="bg-slate-900/90 p-4 rounded-xl border border-cyan-500/30">
            <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider mb-1">MISSION DIRECTIVE</div>
            <h2 className="font-heading font-bold text-base text-white mb-1">{dossierData.mission_title}</h2>
            <p className="text-slate-300 text-xs italic">Target Expression: "{dossierData.query_objective}"</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              <div className="text-[10px] font-mono text-slate-500">PRIMARY SENSOR</div>
              <div className="font-bold text-cyan-300">{dossierData.sensor_telemetry.primary_payload}</div>
            </div>
            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              <div className="text-[10px] font-mono text-slate-500">SPATIAL RESOLUTION</div>
              <div className="font-bold text-amber-400">{dossierData.sensor_telemetry.ground_sampling_distance}</div>
            </div>
            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              <div className="text-[10px] font-mono text-slate-500">SUN ELEVATION / AZ</div>
              <div className="font-bold text-slate-200">
                {dossierData.sensor_telemetry.sun_illumination.elevation} / {dossierData.sensor_telemetry.sun_illumination.azimuth}
              </div>
            </div>
            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              <div className="text-[10px] font-mono text-slate-500">CLOUD PENETRATION</div>
              <div className="font-bold text-emerald-400">{dossierData.sensor_telemetry.cloud_cover_percentage}</div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span>Grounded Targets & Spectral Spatial Quantification</span>
            </h3>
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead className="bg-slate-950 text-slate-400 text-[10px]">
                  <tr>
                    <th className="p-2.5 border-b border-slate-800">TARGET DESIGNATION</th>
                    <th className="p-2.5 border-b border-slate-800">FOOTPRINT</th>
                    <th className="p-2.5 border-b border-slate-800">CONFIDENCE</th>
                    <th className="p-2.5 border-b border-slate-800">THREAT RATING</th>
                    <th className="p-2.5 border-b border-slate-800">SPECTRAL SIGNATURE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 bg-slate-900/50">
                  {dossierData.key_grounding_findings.map(item => (
                    <tr key={item.id} className="hover:bg-slate-800/50">
                      <td className="p-2.5 font-semibold text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                        <span>{item.label}</span>
                      </td>
                      <td className="p-2.5 text-cyan-300 font-bold">{item.area_km2 || 0} km²</td>
                      <td className="p-2.5 text-emerald-400">{((item.confidence || 0.96) * 100).toFixed(1)}%</td>
                      <td className="p-2.5">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold" style={{ backgroundColor: `${item.color}25`, color: item.color }}>
                          {item.threat_level || 'MONITORED'}
                        </span>
                      </td>
                      <td className="p-2.5 text-amber-300 text-[11px]">{item.spectral_index}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-rose-950/20 border border-rose-500/30 p-4 rounded-xl space-y-2">
              <h4 className="font-heading font-bold text-xs text-rose-400 flex items-center gap-1.5 uppercase">
                <AlertTriangle className="w-4 h-4" />
                <span>Vulnerability Assessment ({dossierData.vulnerability_assessment.threat_rating})</span>
              </h4>
              <p className="text-slate-300 text-xs font-semibold">
                Estimated Affected Population: {dossierData.vulnerability_assessment.affected_population_estimate}
              </p>
              <ul className="space-y-1 text-slate-400 text-[11px] list-disc list-inside">
                {dossierData.vulnerability_assessment.critical_lifelines_impacted.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>

            <div className="bg-emerald-950/20 border border-emerald-500/30 p-4 rounded-xl space-y-2">
              <h4 className="font-heading font-bold text-xs text-emerald-400 flex items-center gap-1.5 uppercase">
                <CheckCircle2 className="w-4 h-4" />
                <span>Operational Response Protocols</span>
              </h4>
              <ul className="space-y-1.5 text-slate-300 text-[11px]">
                {dossierData.actionable_directives.map((d, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-emerald-400 font-bold font-mono">[{i + 1}]</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[10px] text-slate-500">
            <div>
              <div>AUTHENTICATED BY: <strong className="text-slate-300">{dossierData.signatory.authorized_by}</strong></div>
              <div className="truncate max-w-sm">DIGITAL SEAL: {dossierData.signatory.verification_hash}</div>
            </div>
            <div className="px-3 py-1.5 rounded bg-slate-950 border border-slate-800 text-cyan-400 font-bold">
              VERIFIED ISRO-NRSC DATA PRODUCT
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
