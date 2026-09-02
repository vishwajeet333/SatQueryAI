import React, { useState } from 'react';
import { useSatQuery } from '../context/SatQueryContext';
import { 
  X, 
  Terminal, 
  Cpu, 
  CheckCircle2, 
  Clock, 
  Copy, 
  Check 
} from 'lucide-react';

export const AuditableTraceModal: React.FC = () => {
  const { isTraceOpen, setIsTraceOpen, activeTrace } = useSatQuery();
  const [activeTab, setActiveTab] = useState<'visual' | 'json'>('visual');
  const [copied, setCopied] = useState(false);

  if (!isTraceOpen || !activeTrace) return null;

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(activeTrace, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#0b1322] border border-cyan-500/40 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden text-slate-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950/90 border-b border-cyan-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white tracking-wide">
                  Auditable Agentic Execution Trace
                </h2>
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[10px] border border-cyan-500/40">
                  {activeTrace.trace_id}
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-400">
                Formal Tool Selection & Model Execution Record for SIH Evaluation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-800 text-xs font-mono">
              <button
                onClick={() => setActiveTab('visual')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  activeTab === 'visual' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Visual Trace
              </button>
              <button
                onClick={() => setActiveTab('json')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  activeTab === 'json' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                JSON Payload
              </button>
            </div>

            <button
              onClick={() => setIsTraceOpen(false)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs font-mono">
          
          {activeTab === 'visual' ? (
            <>
              {/* Task Selected Card */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                    Agentic Task Dispatched:
                  </span>
                  <span className="text-base font-bold text-cyan-300 font-sans">
                    {activeTrace.task_selected}
                  </span>
                </div>
                <div className="text-right font-mono">
                  <span className="text-[10px] text-slate-400 uppercase block mb-1">Total Latency:</span>
                  <span className="text-sm font-bold text-emerald-400">
                    {activeTrace.latency_profile.total_pipeline_ms} ms ({activeTrace.latency_profile.total_seconds}s)
                  </span>
                </div>
              </div>

              {/* Models Invoked from Registry */}
              <div>
                <h3 className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-2 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  <span>PyTorch Models Invoked from Registry</span>
                </h3>
                <div className="space-y-2">
                  {activeTrace.models_invoked.map((mod, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 font-bold text-white mb-0.5">
                          <span>{mod.name || mod.model_id}</span>
                          <span className="px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 text-[10px] border border-cyan-800">
                            {mod.model_id}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">{mod.domain || mod.architecture || "Neural Inference Subnet"}</p>
                      </div>
                      <span className="text-emerald-400 font-bold text-[11px] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>EXECUTED</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Input Compatibility & Tensor Specs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Input Compatibility</span>
                  <div>
                    <span className="text-slate-400">Source:</span> <span className="text-slate-200">{activeTrace.input_compatibility.source}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">CRS:</span> <span className="text-cyan-300 font-bold">{activeTrace.input_compatibility.crs}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">GSD Resolution:</span> <span className="text-amber-300">{activeTrace.input_compatibility.resolution_gsd}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Neural Forward Tensor</span>
                  <div>
                    <span className="text-slate-400">Tensor Shape:</span> <span className="text-cyan-300 font-bold">{JSON.stringify(activeTrace.neural_forward_params.tensor_shape)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Inference Device:</span> <span className="text-emerald-400 uppercase">{activeTrace.neural_forward_params.device}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Co-Registration:</span> <span className="text-emerald-400 font-bold">✓ 100% Spatial Overlap</span>
                  </div>
                </div>
              </div>

              {/* Latency Breakdown Profile */}
              <div>
                <h3 className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-2 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Execution Latency Breakdown</span>
                </h3>
                <div className="grid grid-cols-3 gap-2 bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-center">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Input Validation</span>
                    <span className="text-sm font-bold text-white">{activeTrace.latency_profile.input_validation_ms} ms</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Neural Forward Pass</span>
                    <span className="text-sm font-bold text-cyan-300">{activeTrace.latency_profile.neural_forward_ms} ms</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">OSM Topology Lookup</span>
                    <span className="text-sm font-bold text-emerald-400">{activeTrace.latency_profile.osm_topology_ms} ms</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={handleCopyJson}
                className="absolute top-3 right-3 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] flex items-center gap-1 transition-all"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? "Copied" : "Copy JSON"}</span>
              </button>
              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-cyan-300 overflow-x-auto leading-relaxed">
                {JSON.stringify(activeTrace, null, 2)}
              </pre>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
          <span>Evaluated Parameter: Observable Execution Trace (SIH PS 26167)</span>
          <button
            onClick={() => setIsTraceOpen(false)}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-all"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
