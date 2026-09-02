import React from 'react';
import { useSatQuery } from '../context/SatQueryContext';
import { Download, MapPin } from 'lucide-react';
import confetti from 'canvas-confetti';

export const AnalyticsPanel: React.FC = () => {
  const {
    groundingItems,
    focusedGroundingId,
    setFocusedGroundingId,
    activeScenario
  } = useSatQuery();

  const handleExportGeoJSON = () => {
    if (!activeScenario) return;
    window.open(`/api/export-geojson/${activeScenario.id}`, '_blank');
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.85 } });
  };

  const handleExportKML = () => {
    const kmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>${activeScenario?.title || 'SatQuery Intelligence'}</name>
    <description>Exported from SatQuery AI - ISRO Vision-Language Earth Observation Platform</description>
    ${groundingItems.map(item => `
    <Placemark>
      <name>${item.label}</name>
      <description>Threat: ${item.threat_level || 'N/A'}, Area: ${item.area_km2 || 0} km2, Conf: ${item.confidence}</description>
      <Polygon>
        <outerBoundaryIs>
          <LinearRing>
            <coordinates>
              ${item.coordinates.map(c => `${c[1]},${c[0]},0`).join(' ')}
            </coordinates>
          </LinearRing>
        </outerBoundaryIs>
      </Polygon>
    </Placemark>`).join('')}
  </Document>
</kml>`;

    const blob = new Blob([kmlContent], { type: 'application/vnd.google-earth.kml+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `satquery_${activeScenario?.id || 'export'}.kml`;
    a.click();
    URL.revokeObjectURL(url);
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.85 } });
  };

  const totalArea = groundingItems.reduce((acc, curr) => acc + (curr.area_km2 || 0), 0);

  return (
    <div className="glass-panel rounded-2xl p-4 border border-cyan-500/20 shadow-xl space-y-4 select-none">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-cyan-400" />
          <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">
            Grounded Targets & Vector Layer
          </h3>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">
          {groundingItems.length} Features Pinned
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
          <div className="text-[10px] font-mono text-slate-500">AGGREGATED IMPACT AREA</div>
          <div className="text-sm font-bold font-mono text-cyan-300">
            {totalArea.toFixed(2)} km² <span className="text-[10px] text-slate-500">({(totalArea * 100).toFixed(0)} ha)</span>
          </div>
        </div>
        <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
          <div className="text-[10px] font-mono text-slate-500">MAX CONFIDENCE</div>
          <div className="text-sm font-bold font-mono text-emerald-400">
            {(Math.max(...groundingItems.map(g => g.confidence), 0.95) * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
        {groundingItems.map(item => {
          const isFocused = item.id === focusedGroundingId;
          return (
            <div
              key={item.id}
              onClick={() => setFocusedGroundingId(item.id)}
              className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                isFocused
                  ? 'bg-cyan-500/15 border-cyan-400 shadow-md shadow-cyan-500/10'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 font-semibold text-slate-200">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="truncate max-w-[170px]">{item.label}</span>
                </div>
                <span
                  className="text-[9px] font-mono px-1.5 py-0.2 rounded font-bold"
                  style={{ backgroundColor: `${item.color}20`, color: item.color }}
                >
                  {item.threat_level || 'ACTIVE'}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 line-clamp-1">{item.details}</p>
              <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-slate-900 text-[10px] font-mono text-slate-500">
                <span>Area: <strong className="text-slate-300">{item.area_km2 || 0} km²</strong></span>
                <span>Conf: <strong className="text-emerald-400">{(item.confidence * 100).toFixed(1)}%</strong></span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-2 border-t border-slate-800 space-y-2">
        <div className="text-[10px] font-mono text-slate-400">EXPORT SPATIAL LAYERS:</div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleExportGeoJSON}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-cyan-500/20 text-cyan-300 hover:text-cyan-200 border border-cyan-500/40 text-xs font-mono transition-all"
            title="Download GeoJSON FeatureCollection"
          >
            <Download className="w-3.5 h-3.5" />
            <span>GeoJSON</span>
          </button>

          <button
            onClick={handleExportKML}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-emerald-500/20 text-emerald-300 hover:text-emerald-200 border border-emerald-500/40 text-xs font-mono transition-all"
            title="Download KML for Google Earth"
          >
            <Download className="w-3.5 h-3.5" />
            <span>KML</span>
          </button>
        </div>
      </div>
    </div>
  );
};
