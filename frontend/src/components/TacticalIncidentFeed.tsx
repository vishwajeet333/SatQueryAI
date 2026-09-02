import React, { useRef, useEffect } from 'react';
import { useSatQuery } from '../context/SatQueryContext';
import { 
  Volume2, 
  VolumeX, 
  MapPin, 
  Clock, 
  Radio,
  FileText,
  User,
  Bot
} from 'lucide-react';

export const TacticalIncidentFeed: React.FC = () => {
  const { 
    messages, 
    isLoading, 
    focusedGroundingId, 
    setFocusedGroundingId, 
    isSpeaking, 
    speakText, 
    stopSpeaking,
    generateReport,
    fieldInfrastructure,
    setActiveTrace,
    setIsTraceOpen
  } = useSatQuery();

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-full bg-[#080e1b]/95 border-l border-cyan-500/20 shadow-2xl relative select-none">
      
      {/* Header */}
      <div className="px-4 py-3 border-b border-cyan-500/20 bg-slate-950/70 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-sm text-white">Incident Dispatch Feed</h2>
            <p className="text-[10px] font-mono text-slate-400">NDRF / SDRF Action Stream</p>
          </div>
        </div>

        {isSpeaking && (
          <button
            onClick={stopSpeaking}
            className="flex items-center gap-1 px-2 py-1 rounded bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-mono animate-pulse"
          >
            <VolumeX className="w-3.5 h-3.5" />
            <span>Mute</span>
          </button>
        )}
      </div>

      {/* Messages / Directives List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isAssistant = msg.sender === 'assistant';

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'} gap-1.5 animate-in fade-in duration-200`}
            >
              <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 px-1">
                {isAssistant ? (
                  <>
                    <Bot className="w-3 h-3 text-cyan-400" />
                    <span className="text-cyan-400 font-semibold">Officer AI Copilot</span>
                  </>
                ) : (
                  <>
                    <span className="text-slate-300">Field Commander</span>
                    <User className="w-3 h-3 text-slate-400" />
                  </>
                )}
                <span>{msg.timestamp}</span>
              </div>

              <div
                className={`p-3.5 rounded-xl max-w-[95%] text-xs leading-relaxed ${
                  isAssistant
                    ? 'bg-slate-900/90 border border-cyan-500/30 text-slate-200 shadow-lg'
                    : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium shadow-md'
                }`}
              >
                <div className="whitespace-pre-wrap font-sans text-xs space-y-1">
                  {msg.text}
                </div>

                {/* Grounding Action Badges */}
                {isAssistant && msg.grounding && msg.grounding.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-800 flex flex-wrap gap-1.5">
                    {msg.grounding.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setFocusedGroundingId(item.id)}
                        className={`px-2 py-1 rounded-md text-[11px] font-mono flex items-center gap-1 transition-all ${
                          focusedGroundingId === item.id
                            ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                            : 'bg-slate-950/80 hover:bg-slate-800 text-slate-300 border border-slate-700'
                        }`}
                      >
                        <MapPin className="w-3 h-3" style={{ color: item.color }} />
                        <span>{item.label}</span>
                        {item.area_km2 && (
                          <span className="text-[9px] opacity-75">({item.area_km2} km²)</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {/* Direct Action Trigger inside message */}
                {isAssistant && (
                  <div className="mt-2.5 flex items-center flex-wrap gap-2">
                    <button
                      onClick={() => speakText(msg.text)}
                      className="px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[10px] font-mono flex items-center gap-1 transition-all"
                    >
                      <Volume2 className="w-3 h-3 text-cyan-400" />
                      <span>Audio</span>
                    </button>
                    <button
                      onClick={generateReport}
                      className="px-2 py-1 rounded bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono flex items-center gap-1 transition-all"
                    >
                      <FileText className="w-3 h-3 text-emerald-400" />
                      <span>Rescue Report</span>
                    </button>
                    {msg.execution_trace && (
                      <button
                        onClick={() => {
                          setActiveTrace(msg.execution_trace || null);
                          setIsTraceOpen(true);
                        }}
                        className="px-2 py-1 rounded bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono flex items-center gap-1 transition-all"
                      >
                        <Radio className="w-3 h-3 text-cyan-400" />
                        <span>Execution Trace</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-900/60 border border-cyan-500/20 text-cyan-300 font-mono text-xs animate-pulse">
            <Clock className="w-3.5 h-3.5 animate-spin" />
            <span>Running U-Net Neural Hazard Segmentation & OSM Topology...</span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Critical Infrastructure Quick Overview Footer */}
      {fieldInfrastructure && (
        <div className="p-3 border-t border-slate-800 bg-slate-950/90 text-xs font-mono space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-400 uppercase font-bold">
            <span>Critical Field Nodes</span>
            <span className="text-emerald-400">Live Grid</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 rounded-lg bg-red-950/30 border border-red-500/30">
              <span className="text-[10px] text-red-300 block">Bridge Status</span>
              <span className="font-bold text-red-200 text-xs truncate block">
                {fieldInfrastructure.blocked_routes[0]?.name || "Severed"}
              </span>
            </div>
            <div className="p-2 rounded-lg bg-emerald-950/30 border border-emerald-500/30">
              <span className="text-[10px] text-emerald-300 block">Base Helipad</span>
              <span className="font-bold text-emerald-200 text-xs truncate block">
                {fieldInfrastructure.safe_staging_zones[0]?.name.split(' ')[0] || "Active"}
              </span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
