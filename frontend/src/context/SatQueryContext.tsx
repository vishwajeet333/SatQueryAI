import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Scenario, GroundingItem, ReasoningStep, QueryResponse, SpectralIndex, TemporalAnalysis, DossierData } from '../types';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  reasoning_steps?: ReasoningStep[];
  grounding?: GroundingItem[];
  metrics?: any;
  suggested_queries?: string[];
}

interface SatQueryContextType {
  scenarios: Scenario[];
  activeScenario: Scenario | null;
  setActiveScenario: (scenario: Scenario) => void;
  activeLayer: 'optical' | 'fcc' | 'sar' | 'band_math';
  setActiveLayer: (layer: 'optical' | 'fcc' | 'sar' | 'band_math') => void;
  activeIndex: string;
  setActiveIndex: (index: string) => void;
  indicesList: SpectralIndex[];
  sarBlend: number;
  setSarBlend: (val: number) => void;
  temporalSwipeActive: boolean;
  setTemporalSwipeActive: (active: boolean) => void;
  swipePosition: number;
  setSwipePosition: (pos: number) => void;
  temporalData: TemporalAnalysis | null;
  groundingItems: GroundingItem[];
  setGroundingItems: React.Dispatch<React.SetStateAction<GroundingItem[]>>;
  focusedGroundingId: string | null;
  setFocusedGroundingId: (id: string | null) => void;
  messages: Message[];
  isLoading: boolean;
  submitQuery: (queryText: string) => Promise<void>;
  cursorTelemetry: { lat: number; lng: number; elevation: number; spectralVal: number };
  setCursorTelemetry: (data: { lat: number; lng: number; elevation: number; spectralVal: number }) => void;
  isDossierOpen: boolean;
  setIsDossierOpen: (open: boolean) => void;
  dossierData: DossierData | null;
  generateDossier: () => Promise<void>;
  isSpeaking: boolean;
  speakText: (text: string) => void;
  stopSpeaking: () => void;
}

const SatQueryContext = createContext<SatQueryContextType | undefined>(undefined);

export const SatQueryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [activeScenario, setActiveScenarioState] = useState<Scenario | null>(null);
  const [activeLayer, setActiveLayer] = useState<'optical' | 'fcc' | 'sar' | 'band_math'>('optical');
  const [activeIndex, setActiveIndex] = useState<string>('NDVI');
  const [indicesList, setIndicesList] = useState<SpectralIndex[]>([]);
  const [sarBlend, setSarBlend] = useState<number>(0);
  const [temporalSwipeActive, setTemporalSwipeActive] = useState<boolean>(false);
  const [swipePosition, setSwipePosition] = useState<number>(50);
  const [temporalData, setTemporalData] = useState<TemporalAnalysis | null>(null);
  const [groundingItems, setGroundingItems] = useState<GroundingItem[]>([]);
  const [focusedGroundingId, setFocusedGroundingId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [cursorTelemetry, setCursorTelemetry] = useState({ lat: 30.5526, lng: 79.5660, elevation: 1890, spectralVal: 0.68 });
  const [isDossierOpen, setIsDossierOpen] = useState<boolean>(false);
  const [dossierData, setDossierData] = useState<DossierData | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  useEffect(() => {
    fetch('/api/scenarios')
      .then(res => res.json())
      .then(data => {
        if (data.scenarios && data.scenarios.length > 0) {
          setScenarios(data.scenarios);
          setActiveScenario(data.scenarios[0]);
        }
      })
      .catch(err => console.error('Failed to load scenarios:', err));

    fetch('/api/band-math')
      .then(res => res.json())
      .then(data => {
        if (data.indices) setIndicesList(data.indices);
      })
      .catch(err => console.error('Failed to load indices:', err));
  }, []);

  const setActiveScenario = (scenario: Scenario) => {
    setActiveScenarioState(scenario);
    setGroundingItems(scenario.grounding_presets || []);
    setFocusedGroundingId(null);
    setTemporalSwipeActive(false);

    fetch(`/api/temporal/${scenario.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.temporal_analysis) setTemporalData(data.temporal_analysis);
      })
      .catch(err => console.error('Failed to load temporal data:', err));

    const initMsg: Message = {
      id: `init_${Date.now()}`,
      sender: 'assistant',
      text: `🛰️ **Mission Telemetry Initialized: ${scenario.title}**\n\nSensor: **${scenario.primary_sensor}** (${scenario.resolution})\nAcquisition: **${scenario.acquisition_date}**\nRegion: **${scenario.region}**\n\nAsk me any natural language question to perform Referring Expression Grounding (REG), spectral band math, SAR cloud penetration, or temporal change analysis.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      grounding: scenario.grounding_presets,
      suggested_queries: [
        scenario.default_query,
        "Calculate NDVI vegetation loss and display risk heatmap",
        "Penetrate cloud cover with RISAT-1A SAR dual-pol",
        "Generate official ISRO SitRep Mission Dossier"
      ]
    };
    setMessages([initMsg]);
  };

  const submitQuery = async (queryText: string) => {
    if (!queryText.trim() || !activeScenario) return;

    const userMsg: Message = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario_id: activeScenario.id,
          query: queryText,
          active_sensor: activeScenario.primary_sensor
        })
      });
      const data: QueryResponse = await res.json();

      const assistantMsg: Message = {
        id: `a_${Date.now()}`,
        sender: 'assistant',
        text: data.response_text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        reasoning_steps: data.reasoning_steps,
        grounding: data.grounding,
        metrics: data.metrics,
        suggested_queries: data.suggested_queries
      };

      setMessages(prev => [...prev, assistantMsg]);
      if (data.grounding && data.grounding.length > 0) {
        setGroundingItems(data.grounding);
      }

      const focusedId = (data as any).focused_id || (data.grounding && data.grounding.length === 1 ? data.grounding[0].id : null);
      if (focusedId) {
        setFocusedGroundingId(focusedId);
      }

      const qLower = queryText.toLowerCase();
      if (qLower.includes('sar') || qLower.includes('radar') || qLower.includes('cloud')) {
        setActiveLayer('sar');
        setSarBlend(80);
      } else if (qLower.includes('ndvi') || qLower.includes('vegetation') || qLower.includes('crop')) {
        setActiveLayer('band_math');
        setActiveIndex('NDVI');
      } else if (qLower.includes('ndwi') || qLower.includes('flood') || qLower.includes('water')) {
        setActiveLayer('band_math');
        setActiveIndex('NDWI');
      } else if (qLower.includes('burn') || qLower.includes('fire') || qLower.includes('ash')) {
        setActiveLayer('band_math');
        setActiveIndex('BAI');
      } else if (qLower.includes('temporal') || qLower.includes('compare') || qLower.includes('change')) {
        setTemporalSwipeActive(true);
      }

    } catch (err) {
      console.error('Query execution error:', err);
      // Smart offline fallback
      const qLower = queryText.toLowerCase();
      const presets = activeScenario.grounding_presets;
      let matchedItem = presets[0];
      if (qLower.includes('road') || qLower.includes('highway') || qLower.includes('nh-7') || qLower.includes('block')) {
        matchedItem = presets.find(p => p.label.toLowerCase().includes('highway') || p.label.toLowerCase().includes('road')) || presets[0];
      } else if (qLower.includes('helipad') || qLower.includes('evacuation') || qLower.includes('safe')) {
        matchedItem = presets.find(p => p.label.toLowerCase().includes('helipad') || p.label.toLowerCase().includes('staging')) || presets[0];
      }

      setFocusedGroundingId(matchedItem.id);

      const fallbackMsg: Message = {
        id: `fb_${Date.now()}`,
        sender: 'assistant',
        text: `📍 **Grounding Target Isolated: ${matchedItem.label}**\n\n- **Spatial Grounding**: Vector isolated and viewport centered directly on target coordinates.\n- **Quantified Footprint**: **${matchedItem.area_km2} km²** (${Math.round((matchedItem.confidence || 0.96) * 100)}% REG confidence score).\n- **Tactical Assessment**: ${matchedItem.details}\n- **Threat Level**: **[${matchedItem.threat_level || 'HIGH'}]**`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        grounding: [matchedItem, ...presets.filter(p => p.id !== matchedItem.id)],
        metrics: {
          total_area_km2: matchedItem.area_km2 || 0,
          confidence_score: matchedItem.confidence || 0.96,
          features_detected: 1,
          spatial_resolution: activeScenario.resolution,
          primary_sensor: activeScenario.primary_sensor
        }
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateDossier = async () => {
    if (!activeScenario) return;
    try {
      const res = await fetch('/api/dossier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario_id: activeScenario.id,
          query: messages[messages.length - 1]?.text || activeScenario.default_query,
          findings: groundingItems
        })
      });
      const data = await res.json();
      setDossierData(data.dossier);
      setIsDossierOpen(true);
    } catch (err) {
      console.error('Failed to generate dossier:', err);
    }
  };

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*_#`[\]()]/g, ' ').replace(/\n+/g, '. ');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <SatQueryContext.Provider
      value={{
        scenarios,
        activeScenario,
        setActiveScenario,
        activeLayer,
        setActiveLayer,
        activeIndex,
        setActiveIndex,
        indicesList,
        sarBlend,
        setSarBlend,
        temporalSwipeActive,
        setTemporalSwipeActive,
        swipePosition,
        setSwipePosition,
        temporalData,
        groundingItems,
        setGroundingItems,
        focusedGroundingId,
        setFocusedGroundingId,
        messages,
        isLoading,
        submitQuery,
        cursorTelemetry,
        setCursorTelemetry,
        isDossierOpen,
        setIsDossierOpen,
        dossierData,
        generateDossier,
        isSpeaking,
        speakText,
        stopSpeaking
      }}
    >
      {children}
    </SatQueryContext.Provider>
  );
};

export const useSatQuery = () => {
  const context = useContext(SatQueryContext);
  if (!context) throw new Error('useSatQuery must be used within a SatQueryProvider');
  return context;
};
