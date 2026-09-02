import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, Polyline, Tooltip, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useSatQuery } from '../context/SatQueryContext';
import type { GroundingItem } from '../types';
import { Crosshair, Sparkles } from 'lucide-react';

const MapViewController: React.FC<{ center: [number, number]; zoom: number; focusedItem: GroundingItem | null }> = ({
  center,
  zoom,
  focusedItem
}) => {
  const map = useMap();

  useEffect(() => {
    if (focusedItem && focusedItem.coordinates.length > 0) {
      const bounds = L.latLngBounds(focusedItem.coordinates.map(c => [c[0], c[1]]));
      map.flyToBounds(bounds, { padding: [80, 80], maxZoom: 16, duration: 1.5 });
    } else {
      map.flyTo(center, zoom, { duration: 1.5 });
    }
  }, [center, zoom, focusedItem, map]);

  return null;
};

const CursorTracker: React.FC = () => {
  const { setCursorTelemetry } = useSatQuery();

  useMapEvents({
    mousemove(e) {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      const elevation = Math.round(1400 + Math.sin(lat * 10) * 450 + Math.cos(lng * 10) * 350);
      const spectralVal = Number((0.45 + (Math.sin(lat * 20 + lng * 20) * 0.4)).toFixed(2));
      setCursorTelemetry({ lat, lng, elevation, spectralVal });
    }
  });

  return null;
};

export const MapCanvas: React.FC = () => {
  const {
    activeScenario,
    activeLayer,
    activeIndex,
    sarBlend,
    groundingItems,
    focusedGroundingId,
    setFocusedGroundingId,
    cursorTelemetry
  } = useSatQuery();

  if (!activeScenario) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#060b13] text-cyan-400 font-mono text-xs">
        INITIALIZING ORBITAL SATELLITE CANVAS...
      </div>
    );
  }

  const focusedItem = groundingItems.find(g => g.id === focusedGroundingId) || null;
  const esriSatelliteUrl = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";

  return (
    <div className="relative w-full h-full bg-[#060b13] overflow-hidden">
      <MapContainer
        center={activeScenario.center}
        zoom={activeScenario.zoom}
        scrollWheelZoom={true}
        zoomControl={false}
        className="w-full h-full z-0"
      >
        <MapViewController
          center={activeScenario.center}
          zoom={activeScenario.zoom}
          focusedItem={focusedItem}
        />
        <CursorTracker />

        <TileLayer
          attribution='&copy; ISRO / NRSC / ESRI'
          url={esriSatelliteUrl}
          maxZoom={19}
        />

        {activeLayer === 'band_math' && (
          <div
            className="leaflet-pane leaflet-overlay-pane pointer-events-none"
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 350,
              mixBlendMode: 'color-dodge',
              opacity: 0.65,
              background: activeScenario.layers.ndvi_overlay
            }}
          />
        )}

        {activeLayer === 'sar' && (
          <div
            className="leaflet-pane leaflet-overlay-pane pointer-events-none"
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 350,
              mixBlendMode: 'luminosity',
              opacity: sarBlend > 0 ? sarBlend / 100 : 0.75,
              filter: 'contrast(2.2) brightness(1.2) hue-rotate(180deg)',
              background: 'radial-gradient(circle, rgba(0,255,136,0.35) 0%, rgba(0,240,255,0.2) 100%)'
            }}
          />
        )}

        {groundingItems.map(item => {
          const isFocused = item.id === focusedGroundingId;

          if (item.type === 'polygon') {
            return (
              <Polygon
                key={item.id}
                positions={item.coordinates}
                pathOptions={{
                  color: item.color,
                  fillColor: item.color,
                  fillOpacity: isFocused ? 0.6 : 0.35,
                  weight: isFocused ? 3.5 : 2,
                  dashArray: isFocused ? '6, 6' : undefined
                }}
                eventHandlers={{
                  click: () => setFocusedGroundingId(item.id)
                }}
              >
                <Tooltip permanent={isFocused} direction="top" className="custom-leaflet-tooltip">
                  <div className="font-sans text-xs px-1 py-0.5 font-bold text-slate-100 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                    <span>{item.label}</span>
                    {item.area_km2 && (
                      <span className="text-[10px] font-mono text-cyan-300">({item.area_km2} km²)</span>
                    )}
                  </div>
                </Tooltip>
                <Popup className="custom-leaflet-popup">
                  <div className="p-2 font-sans max-w-xs">
                    <div className="flex items-center justify-between gap-2 border-b border-slate-700 pb-1.5 mb-1.5">
                      <span className="font-heading font-bold text-xs text-white">{item.label}</span>
                      <span
                        className="text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase"
                        style={{ backgroundColor: `${item.color}25`, color: item.color, border: `1px solid ${item.color}50` }}
                      >
                        {item.threat_level || 'DETECTED'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 mb-2 leading-tight">{item.details}</p>
                    <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono bg-slate-950/80 p-2 rounded border border-slate-800">
                      <div>
                        <span className="text-slate-500">Area:</span> <span className="text-cyan-300 font-semibold">{item.area_km2} km²</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Confidence:</span> <span className="text-emerald-400 font-semibold">{(item.confidence * 100).toFixed(1)}%</span>
                      </div>
                      <div className="col-span-2 text-slate-400 truncate">
                        <span className="text-slate-500">Signature:</span> <span className="text-amber-300">{item.spectral_index}</span>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Polygon>
            );
          } else if (item.type === 'polyline') {
            return (
              <Polyline
                key={item.id}
                positions={item.coordinates}
                pathOptions={{
                  color: item.color,
                  weight: isFocused ? 5 : 3.5,
                  dashArray: '8, 8'
                }}
                eventHandlers={{
                  click: () => setFocusedGroundingId(item.id)
                }}
              >
                <Tooltip direction="top">
                  <div className="font-sans text-xs px-1 font-bold text-slate-100">{item.label}</div>
                </Tooltip>
              </Polyline>
            );
          }
          return null;
        })}
      </MapContainer>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20 flex flex-col items-center opacity-40">
        <Crosshair className="w-8 h-8 text-cyan-400/80" />
      </div>

      <div className="absolute bottom-4 left-4 z-20 flex items-center gap-3">
        <div className="glass-panel px-3.5 py-2 rounded-xl text-xs font-mono text-slate-300 flex items-center gap-4 border border-cyan-500/30">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
            <span className="text-slate-400">GSD:</span>
            <span className="text-cyan-300 font-bold">{activeScenario.resolution}</span>
          </div>
          <div className="h-3 w-px bg-slate-700"></div>
          <div>
            <span className="text-slate-400">DEM ELEV:</span>{' '}
            <span className="text-amber-300 font-bold">{cursorTelemetry.elevation}m MSL</span>
          </div>
          <div className="h-3 w-px bg-slate-700"></div>
          <div>
            <span className="text-slate-400">INDEX:</span>{' '}
            <span className="text-emerald-400 font-bold">
              {activeLayer === 'band_math' ? `${activeIndex} ${cursorTelemetry.spectralVal}` : 'RGB (1.00)'}
            </span>
          </div>
        </div>
      </div>

      <div className="absolute top-4 right-4 z-20">
        <div className="glass-panel px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-2 border border-cyan-500/30 shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-400">ACTIVE LAYER:</span>
          <span className="text-cyan-300 font-bold uppercase">
            {activeLayer === 'band_math' ? `BAND MATH (${activeIndex})` : activeLayer}
          </span>
        </div>
      </div>
    </div>
  );
};
