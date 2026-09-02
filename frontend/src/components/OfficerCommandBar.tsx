import React, { useState } from 'react';
import { useSatQuery } from '../context/SatQueryContext';
import { 
  Search, 
  Mic, 
  MicOff, 
  FileText, 
  Sparkles,
  Clock
} from 'lucide-react';

export const OfficerCommandBar: React.FC = () => {
  const { 
    submitQuery, 
    isLoading, 
    latestLatency, 
    generateReport, 
    language 
  } = useSatQuery();

  const [inputVal, setInputVal] = useState('');
  const [isListening, setIsListening] = useState(false);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim() || isLoading) return;
    submitQuery(inputVal);
    setInputVal('');
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language === 'hi' ? 'hi-IN' : language === 'ml' ? 'ml-IN' : 'en-IN';
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const speechText = event.results[0][0].transcript;
      setInputVal(speechText);
      setIsListening(false);
      submitQuery(speechText);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  const quickPrompts = language === 'hi' ? [
    "चोरलमला में टूटे हुए पुल और फंसे हुए लोग कहां हैं?",
    "तीस्ता नदी में डूबे हुए रास्ते खोजें",
    "निकटतम चालू अस्पताल और सुरक्षित हेलीपैड"
  ] : language === 'ml' ? [
    "ചൂരൽമലയിലെ തകർന്ന പാലവും ഒറ്റപ്പെട്ട ജനങ്ങളും എവിടെയാണ്?",
    "തീസ്ത നദിയിലെ പ്രളയ മേഖലകൾ കണ്ടെത്തുക",
    "അടുത്തുള്ള ആശുപത്രിയും സുരക്ഷിത ഹെലിപാഡും"
  ] : [
    "Where are the blocked bridges and stranded settlements in Chooralmala?",
    "Locate flooded lifeline routes along Teesta river",
    "Find nearest functional hospital & evacuation helipad"
  ];

  return (
    <div className="w-full bg-[#080e1b]/95 border-b border-cyan-500/20 px-4 py-2.5 flex flex-col gap-2 shadow-xl relative z-20">
      {/* Primary Search Bar Row */}
      <div className="flex items-center gap-3">
        <form onSubmit={handleSubmit} className="flex-1 relative flex items-center">
          <div className="absolute left-3.5 text-cyan-400 pointer-events-none">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={
              language === 'hi' 
                ? "प्राकृतिक भाषा में पूछें (उदा. 'चोरलमला में फंसे हुए लोग और टूटे हुए रास्ते दिखाएं')..."
                : language === 'ml'
                ? "സ്വാഭാവിക ഭാഷയിൽ ചോദിക്കുക (ഉദാ. 'ചൂരൽമലയിലെ തടസ്സപ്പെട്ട വഴികൾ കാണിക്കുക')..."
                : "Ask officer copilot in plain language (e.g. 'Where are the blocked bridges and stranded settlements in Chooralmala?')..."
            }
            className="w-full pl-10 pr-24 py-2.5 rounded-xl bg-slate-900/90 border border-cyan-500/30 text-white placeholder-slate-400 text-sm font-sans focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 shadow-inner"
          />
          <div className="absolute right-2 flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleVoiceInput}
              className={`p-1.5 rounded-lg border transition-all ${
                isListening 
                  ? 'bg-rose-500 text-white border-rose-400 animate-pulse' 
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-cyan-300 hover:border-cyan-500/40'
              }`}
              title="Voice Query (Web Speech API)"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
            <button
              type="submit"
              disabled={isLoading || !inputVal.trim()}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center gap-1 transition-all disabled:opacity-50 shadow-md shadow-cyan-500/20"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isLoading ? "Analyzing..." : "Dispatch"}</span>
            </button>
          </div>
        </form>

        {/* 1-Click Rescue Report Trigger */}
        <button
          onClick={generateReport}
          className="px-3.5 py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-semibold flex items-center gap-2 transition-all shrink-0 shadow-lg shadow-emerald-950/40 hover:scale-[1.02]"
        >
          <FileText className="w-4 h-4 text-emerald-400" />
          <span>Rescue Report (PDF)</span>
          <span className="px-1.5 py-0.5 rounded bg-emerald-500/30 text-[10px] text-emerald-200">
            &lt; 10s
          </span>
        </button>
      </div>

      {/* Chips and Latency Metrics Bar */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto text-[11px] font-mono text-slate-300 pt-0.5">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-slate-400 font-sans text-xs">Suggested:</span>
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => submitQuery(prompt)}
              className="px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-cyan-950/60 border border-slate-700/60 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-200 transition-all truncate max-w-[280px]"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Real Latency Meter */}
        {latestLatency && (
          <div className="flex items-center gap-2 shrink-0 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-cyan-500/30 text-cyan-300 text-[10px]">
            <Clock className="w-3 h-3 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>
              ⚡ Analyzed in <strong className="text-white">{latestLatency.total_seconds}s</strong>
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">
              U-Net: <strong className="text-slate-200">{latestLatency.neural_inference_ms}ms</strong>
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">
              OSM Roads: <strong className="text-slate-200">{latestLatency.osm_infrastructure_ms}ms</strong>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
