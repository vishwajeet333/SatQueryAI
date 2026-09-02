import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, Polyline, CircleMarker, Tooltip, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useSatQuery } from '../context/SatQueryContext';
import type { GroundingItem } from '../types';
import { Crosshair, Navigation } from 'lucide-react';

const MapViewController: React.FC<{ center: [number, number]; zoom: number; focusedItem: GroundingItem | null }> = ({
  center,
  zoom,
  focusedItem
}) => {
  const map = useMap();

  useEffect(() => {
    if (focusedItem && focusedItem.coordinates.length > 0) {
      const bounds = L.latLngBounds(focusedItem.coordinates.map(c => [c[0], c[1]]));
      map.flyToBounds(bounds, { padding: [100, 100], maxZoom: 16, duration: 1.2 });
    } else {
      map.flyTo(center, zoom, { duration: 1.2 });
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
      const elevation = Math.round(890 + Math.sin(lat * 10) * 150 + Math.cos(lng * 10) * 120);
      const spectralVal = Number((0.72 + (Math.sin(lat * 20 + lng * 20) * 0.2)).toFixed(2));
      setCursorTelemetry({ lat, lng, elevation, spectralVal });
    }
  });

  return null;
};

export const MapCanvas: React.FC = () => {
  const {
    activeScenario,
    activeLayer,
    sarBlend,
    groundingItems,
    focusedGroundingId,
    setFocusedGroundingId,
    fieldInfrastructure,
    cursorTelemetry
  } = useSatQuery();

  if (!activeScenario) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#060b13] text-cyan-400 font-mono text-xs">
        INITIALIZING DISASTER SATELLITE CANVAS...
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
          attribution='&copy; ISRO / Copernicus Sentinel / ESRI'
          url={esriSatelliteUrl}
          maxZoom={19}
        />

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

        {/* Hazard Grounding Polygons & Lines */}
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
                  fillOpacity: isFocused ? 0.65 : 0.4,
                  weight: isFocused ? 4 : 2,
                  dashArray: isFocused ? '6, 6' : undefined
                }}
                eventHandlers={{
                  click: () => setFocusedGroundingId(item.id)
                }}
              >
                <Tooltip permanent={isFocused} direction="top" className="custom-leaflet-tooltip">
                  <div className="font-sans text-xs px-1 py-0.5 font-bold text-slate-100 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: item.color }}></span>
                    <span>{item.label}</span>
                    {item.area_km2 && (
                      <span className="text-[10px] font-mono text-cyan-300">({item.area_km2} km²)</span>
                    )}
                  </div>
                </Tooltip>
                <Popup className="custom-leaflet-popup">
                  <div className="p-2 font-sans max-w-xs">
                    <div className="flex items-center justify-between gap-2 border-b border-slate-700 pb-1.5 mb-1.5">
                      <span className="font-bold text-xs text-white">{item.label}</span>
                      <span
                        className="text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase"
                        style={{ backgroundColor: `${item.color}25`, color: item.color, border: `1px solid ${item.color}50` }}
                      >
                        {item.threat_level || 'CRITICAL'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 mb-2 leading-tight">{item.details}</p>
                    <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono bg-slate-950/80 p-2 rounded border border-slate-800">
                      <div>
                        <span className="text-slate-500">Area:</span> <span className="text-cyan-300 font-semibold">{item.area_km2} km²</span>
                      </div>
                      <div>
                        <span className="text-slate-500">U-Net Score:</span> <span className="text-emerald-400 font-semibold">{(item.confidence * 100).toFixed(1)}%</span>
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
                  weight: isFocused ? 6 : 4,
                  dashArray: '8, 8'
                }}
                eventHandlers={{
                  click: () => setFocusedGroundingId(item.id)
                }}
              >
                <Tooltip direction="top" permanent={isFocused}>
                  <div className="font-sans text-xs px-1 font-bold text-amber-300 flex items-center gap-1">
                    <Navigation className="w-3 h-3 text-amber-400" />
                    <span>{item.label}</span>
                  </div>
                </Tooltip>
              </Polyline>
            );
          }
          return null;
        })}

        {/* Real OpenStreetMap Infrastructure Markers */}
        {fieldInfrastructure?.hospitals.map(hosp => (
          <CircleMarker
            key={hosp.id}
            center={[hosp.lat, hosp.lng]}
            radius={8}
            pathOptions={{
              color: '#06b6d4',
              fillColor: '#0891b2',
              fillOpacity: 0.85,
              weight: 2
            }}
          >
            <Tooltip direction="top">
              <div className="text-xs font-sans font-bold text-cyan-200">
                🏥 {hosp.name} ({hosp.beds_available} beds)
              </div>
            </Tooltip>
          </CircleMarker>
        ))}

        {fieldInfrastructure?.safe_staging_zones.map(zone => (
          <CircleMarker
            key={zone.id}
            center={[zone.lat, zone.lng]}
            radius={9}
            pathOptions={{
              color: '#10b981',
              fillColor: '#059669',
              fillOpacity: 0.9,
              weight: 2
            }}
          >
            <Tooltip direction="top">
              <div className="text-xs font-sans font-bold text-emerald-200">
                🚁 {zone.name} (Heli-Base)
              </div>
            </Tooltip>
          </CircleMarker>
        ))}

      </MapContainer>

      {/* Crosshair telemetry marker */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20 flex flex-col items-center opacity-40">
        <Crosshair className="w-8 h-8 text-cyan-400/80" />
      </div>

      {/* Field Telemetry Bottom Bar */}
      <div className="absolute bottom-4 left-4 z-20 flex items-center gap-3">
        <div className="glass-panel px-3.5 py-2 rounded-xl text-xs font-mono text-slate-300 flex items-center gap-4 border border-cyan-500/30 shadow-xl">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-slate-400">Sensor:</span>
            <span className="text-cyan-300 font-bold">{activeScenario.primary_sensor}</span>
          </div>
          <div className="h-3 w-px bg-slate-700"></div>
          <div>
            <span className="text-slate-400">DEM Terrain:</span>{' '}
            <span className="text-amber-300 font-bold">{cursorTelemetry.elevation}m MSL</span>
          </div>
          <div className="h-3 w-px bg-slate-700"></div>
          <div>
            <span className="text-slate-400">U-Net Segmenter:</span>{' '}
            <span className="text-emerald-400 font-bold">Ready (10m Res)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
