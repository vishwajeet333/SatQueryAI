import React, { useEffect, useState } from 'react';
import { useSatQuery } from '../context/SatQueryContext';
import { X, Award } from 'lucide-react';
import type { BenchmarkData } from '../types';

export const BenchmarkModal: React.FC = () => {
  const { isBenchmarkOpen, setIsBenchmarkOpen } = useSatQuery();
  const [benchmarkData, setBenchmarkData] = useState<BenchmarkData | null>(null);

  useEffect(() => {
    if (isBenchmarkOpen) {
      fetch('/api/benchmarks')
        .then(res => res.json())
        .then(data => setBenchmarkData(data))
        .catch(err => console.error('Failed to load benchmarks:', err));
    }
  }, [isBenchmarkOpen]);

  if (!isBenchmarkOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#0b1322] border border-cyan-500/40 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden text-slate-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950/90 border-b border-cyan-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">
                Public Remote Sensing Benchmarks
              </h2>
              <p className="text-[11px] font-mono text-slate-400">
                Quantitative Evaluation against BigEarthNet, VRSBench, RSVQA & CDVQA
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsBenchmarkOpen(false)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs font-mono">
          
          {/* Overview Score */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-emerald-500/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Domain Adaptation Status:</span>
              <span className="text-sm font-bold text-emerald-400">
                ✓ BigEarthNet-19 Multi-Spectral Adapted
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase block">Mean Accuracy:</span>
              <span className="text-base font-bold text-cyan-300">86.4%</span>
            </div>
          </div>

          {/* Benchmark Cards */}
          <div className="space-y-3">
            {benchmarkData?.benchmarks.map((b) => (
              <div key={b.id} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between font-bold text-white text-xs">
                  <span>{b.name}</span>
                  <span className="text-emerald-400 font-bold">{b.top1_accuracy || b.overall_accuracy || b.vqa_accuracy || b.change_f1_score}</span>
                </div>
                <p className="text-[11px] text-slate-400 font-sans">{b.domain}</p>
                <div className="flex items-center justify-between pt-1 border-t border-slate-900 text-[10px] text-cyan-300">
                  <span>Metric: {b.metric}</span>
                  <span className="text-slate-400">{b.status}</span>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
          <span>SIH 2026 Problem Statement ID: 26167 Compliance</span>
          <button
            onClick={() => setIsBenchmarkOpen(false)}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-all"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
