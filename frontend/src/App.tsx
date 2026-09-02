import React, { useState } from 'react';
import { SatQueryProvider } from './context/SatQueryContext';
import { Navbar } from './components/Navbar';
import { MapCanvas } from './components/MapCanvas';
import { ChatAssistant } from './components/ChatAssistant';
import { SpectralTools } from './components/SpectralTools';
import { AnalyticsPanel } from './components/AnalyticsPanel';
import { TemporalSwipe } from './components/TemporalSwipe';
import { MissionDossierModal } from './components/MissionDossierModal';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SatQueryDashboard: React.FC = () => {
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);

  return (
    <div className="flex flex-col h-screen w-screen bg-[#060b13] text-slate-100 overflow-hidden select-none">
      <Navbar />

      <div className="flex-1 flex overflow-hidden relative">
        {/* Left GIS Toolset Panel */}
        <div
          className={`h-full border-r border-cyan-500/20 bg-[#080e1b]/90 backdrop-blur-xl z-20 flex flex-col transition-all duration-300 ease-in-out ${
            isLeftPanelOpen ? 'w-80 2xl:w-96' : 'w-0 border-r-0'
          }`}
        >
          {isLeftPanelOpen && (
            <div className="h-full overflow-y-auto p-3 space-y-3">
              <SpectralTools />
              <AnalyticsPanel />
            </div>
          )}
        </div>

        {/* Toggle Button for Left Panel */}
        <button
          onClick={() => setIsLeftPanelOpen(!isLeftPanelOpen)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-30 p-1.5 rounded-r-xl bg-slate-900/90 border-y border-r border-cyan-500/40 text-cyan-400 hover:text-cyan-200 transition-all hover:pl-2"
          style={{ left: isLeftPanelOpen ? (window.innerWidth >= 1536 ? '24rem' : '20rem') : '0px' }}
          title={isLeftPanelOpen ? 'Collapse Tools Panel' : 'Expand Tools Panel'}
        >
          {isLeftPanelOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        {/* Center Interactive Geospatial Map Canvas */}
        <div className="flex-1 h-full relative overflow-hidden">
          <MapCanvas />
          <TemporalSwipe />
        </div>

        {/* Right Geo-VLM Conversational AI Panel */}
        <div className="w-96 2xl:w-[420px] h-full z-20 shrink-0">
          <ChatAssistant />
        </div>
      </div>

      <MissionDossierModal />
    </div>
  );
};

export function App() {
  return (
    <SatQueryProvider>
      <SatQueryDashboard />
    </SatQueryProvider>
  );
}

export default App;
