import React, { useState, useRef, useEffect } from 'react';
import { useSatQuery } from '../context/SatQueryContext';
import { 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  ChevronRight, 
  ChevronDown, 
  Activity, 
  CheckCircle2, 
  Loader2,
  Bot,
  User
} from 'lucide-react';

export const ChatAssistant: React.FC = () => {
  const {
    messages,
    isLoading,
    submitQuery,
    setFocusedGroundingId,
    activeScenario,
    isSpeaking,
    speakText,
    stopSpeaking
  } = useSatQuery();

  const [inputVal, setInputVal] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [expandedCoT, setExpandedCoT] = useState<Record<string, boolean>>({});
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim() || isLoading) return;
    submitQuery(inputVal);
    setInputVal('');
  };

  const handleSpeechInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported in this browser. Please type your query.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const speechResult = event.results[0][0].transcript;
      setInputVal(speechResult);
      setIsListening(false);
      submitQuery(speechResult);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  const toggleCoT = (msgId: string) => {
    setExpandedCoT(prev => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  return (
    <div className="flex flex-col h-full bg-[#080e1b]/95 border-l border-cyan-500/20 glass-panel shadow-2xl relative select-none">
      <div className="px-4 py-3 border-b border-cyan-500/20 bg-slate-950/60 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading font-bold text-sm text-white">SatQuery Geo-VLM</h2>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-400">Geo-Chain-of-Thought Enabled</p>
          </div>
        </div>

        {isSpeaking && (
          <button
            onClick={stopSpeaking}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-mono animate-pulse"
          >
            <VolumeX className="w-3.5 h-3.5" />
            <span>Mute</span>
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => {
          const isAssistant = msg.sender === 'assistant';
          const isCoTExpanded = expandedCoT[msg.id] ?? (idx === messages.length - 1);

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'} gap-1.5 animate-in fade-in slide-in-from-bottom-2 duration-200`}
            >
              <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 px-1">
                {isAssistant ? (
                  <>
                    <Bot className="w-3 h-3 text-cyan-400" />
                    <span>SATQUERY VLM</span>
                  </>
                ) : (
                  <>
                    <User className="w-3 h-3 text-amber-400" />
                    <span>OPERATOR</span>
                  </>
                )}
                <span>•</span>
                <span>{msg.timestamp}</span>
              </div>

              <div
                className={`max-w-[92%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                  isAssistant
                    ? 'bg-slate-900/90 border border-cyan-500/25 text-slate-200 rounded-tl-sm shadow-lg'
                    : 'bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-tr-sm shadow-md font-medium'
                }`}
              >
                <div className="space-y-2 whitespace-pre-line font-sans">
                  {msg.text.split('\n\n').map((para, pIdx) => (
                    <p key={pIdx}>{para}</p>
                  ))}
                </div>

                {isAssistant && msg.reasoning_steps && msg.reasoning_steps.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-cyan-500/20">
                    <button
                      onClick={() => toggleCoT(msg.id)}
                      className="w-full flex items-center justify-between text-[11px] font-mono text-cyan-400 hover:text-cyan-300 transition-colors py-1"
                    >
                      <div className="flex items-center gap-1.5 font-bold">
                        <Activity className="w-3.5 h-3.5" />
                        <span>Geo-Chain-of-Thought (Geo-CoT) Steps ({msg.reasoning_steps.length})</span>
                      </div>
                      {isCoTExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    </button>

                    {isCoTExpanded && (
                      <div className="mt-2 space-y-2 pl-2 border-l-2 border-cyan-500/40 animate-in fade-in duration-150">
                        {msg.reasoning_steps.map(step => (
                          <div key={step.step} className="bg-slate-950/70 p-2 rounded-lg border border-slate-800 text-[11px]">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                <span>{step.step}. {step.title}</span>
                              </span>
                              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                                {step.badge}
                              </span>
                            </div>
                            <p className="text-slate-400 text-[10px] leading-tight font-mono">{step.detail}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {isAssistant && msg.grounding && msg.grounding.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-slate-800">
                    <div className="text-[10px] font-mono text-slate-400 mb-1.5">DETECTED GROUNDED REGIONS:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.grounding.map(item => (
                        <button
                          key={item.id}
                          onClick={() => setFocusedGroundingId(item.id)}
                          className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-mono font-medium transition-all hover:scale-105"
                          style={{
                            backgroundColor: `${item.color}20`,
                            border: `1px solid ${item.color}60`,
                            color: item.color
                          }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                          <span>{item.label}</span>
                          {item.area_km2 && <span className="opacity-80">({item.area_km2}km²)</span>}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {isAssistant && (
                  <div className="mt-2.5 flex justify-end">
                    <button
                      onClick={() => speakText(msg.text)}
                      className="flex items-center gap-1 text-[10px] font-mono text-slate-400 hover:text-cyan-300 transition-colors"
                      title="Audio Readback (Text to Speech)"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>Audio Brief</span>
                    </button>
                  </div>
                )}
              </div>

              {isAssistant && msg.suggested_queries && (
                <div className="flex flex-wrap gap-1.5 mt-1.5 max-w-[92%]">
                  {msg.suggested_queries.map((sq, sIdx) => (
                    <button
                      key={sIdx}
                      onClick={() => submitQuery(sq)}
                      className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-slate-900/90 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-slate-700/60 hover:border-cyan-400/60 transition-all text-left truncate max-w-full"
                    >
                      ✨ {sq}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
            <span>Analyzing multi-spectral bands & synthesizing Geo-CoT grounding...</span>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {isListening && (
        <div className="px-4 py-2 bg-cyan-950/80 border-t border-cyan-400/40 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-300">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            <span>Listening to voice command...</span>
          </div>
          <div className="flex items-center gap-1 h-5">
            <div className="audio-bar w-1 bg-cyan-400 rounded-full"></div>
            <div className="audio-bar w-1 bg-cyan-400 rounded-full"></div>
            <div className="audio-bar w-1 bg-cyan-400 rounded-full"></div>
            <div className="audio-bar w-1 bg-cyan-400 rounded-full"></div>
            <div className="audio-bar w-1 bg-cyan-400 rounded-full"></div>
          </div>
        </div>
      )}

      <form onSubmit={handleSend} className="p-3 border-t border-cyan-500/20 bg-slate-950/80">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            placeholder={`Query ${activeScenario?.primary_sensor || 'satellite'} data...`}
            className="w-full bg-slate-900 border border-cyan-500/30 focus:border-cyan-400 rounded-xl pl-3.5 pr-20 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400/50 transition-all font-sans"
          />

          <div className="absolute right-1.5 flex items-center gap-1">
            <button
              type="button"
              onClick={handleSpeechInput}
              className={`p-1.5 rounded-lg transition-colors ${
                isListening 
                  ? 'bg-rose-500 text-white animate-bounce' 
                  : 'text-slate-400 hover:text-cyan-300 hover:bg-slate-800'
              }`}
              title="Voice Query (Web Speech API)"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <button
              type="submit"
              disabled={!inputVal.trim() || isLoading}
              className="p-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:hover:bg-cyan-500 text-slate-950 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
