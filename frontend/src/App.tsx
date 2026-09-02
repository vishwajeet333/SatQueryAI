import React from 'react';
import { SatQueryProvider } from './context/SatQueryContext';
import { Navbar } from './components/Navbar';
import { OfficerCommandBar } from './components/OfficerCommandBar';
import { MapCanvas } from './components/MapCanvas';
import { TacticalIncidentFeed } from './components/TacticalIncidentFeed';
import { TemporalSwipe } from './components/TemporalSwipe';
import { RescueReportModal } from './components/RescueReportModal';
import { RasterUploadModal } from './components/RasterUploadModal';
import { AuditableTraceModal } from './components/AuditableTraceModal';
import { BenchmarkModal } from './components/BenchmarkModal';

const SatQueryDashboard: React.FC = () => {
  return (
    <div className="flex flex-col h-screen w-screen bg-[#060b13] text-slate-100 overflow-hidden select-none">
      {/* Top Status & Mission Header */}
      <Navbar />

      {/* Hero Officer Command & Dispatch Bar */}
      <OfficerCommandBar />

      {/* Main Tactical Split Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Center/Left: Live Satellite Situation Canvas */}
        <div className="flex-1 h-full relative overflow-hidden">
          <MapCanvas />
          <TemporalSwipe />
        </div>

        {/* Right: Incident Action & Dispatch Stream */}
        <div className="w-96 2xl:w-[440px] h-full z-20 shrink-0">
          <TacticalIncidentFeed />
        </div>
      </div>

      {/* Modals & Inspectors */}
      <RescueReportModal />
      <RasterUploadModal />
      <AuditableTraceModal />
      <BenchmarkModal />
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
