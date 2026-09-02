export type Language = 'en' | 'hi' | 'ml';

export interface GroundingItem {
  id: string;
  label: string;
  type: 'polygon' | 'polyline' | 'point';
  color: string;
  coordinates: [number, number][];
  area_km2?: number;
  confidence: number;
  spectral_index?: string;
  threat_level?: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'SAFE' | string;
  details?: string;
}

export interface ScenarioLayers {
  optical: string;
  fcc: string;
  sar: string;
  ndvi_overlay: string;
  pre_event_date: string;
  post_event_date: string;
}

export interface Scenario {
  id: string;
  title: string;
  region: string;
  center: [number, number];
  zoom: number;
  primary_sensor: string;
  resolution: string;
  acquisition_date: string;
  sun_elevation: string;
  sun_azimuth: string;
  description: string;
  tags: string[];
  layers: ScenarioLayers;
  default_query: string;
  grounding_presets: GroundingItem[];
}

export interface HospitalInfo {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: string;
  beds_available: number;
  distance_km: number;
  helipad_ready: boolean;
}

export interface BlockedRouteInfo {
  id: string;
  name: string;
  coordinates: [number, number][];
  status: string;
  severity: string;
  impact: string;
  bypass_route?: string;
}

export interface SafeStagingZone {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: string;
  capacity: string;
  elevation_msl: string;
}

export interface FieldInfrastructure {
  region: string;
  hospitals: HospitalInfo[];
  blocked_routes: BlockedRouteInfo[];
  safe_staging_zones: SafeStagingZone[];
}

export interface RescueReport {
  report_id: string;
  language: Language;
  title: string;
  timestamp: string;
  mission_title: string;
  region: string;
  primary_sensor: string;
  executive_briefing: string;
  severity_summary: {
    critical_hazard_area_km2: number;
    critical_hazard_count: number;
    safe_zone_count: number;
    overall_status: string;
  };
  critical_hazards: GroundingItem[];
  blocked_infrastructure: BlockedRouteInfo[];
  designated_hospitals: HospitalInfo[];
  safe_staging_zones: SafeStagingZone[];
  action_directives: string[];
  generation_latency_seconds: number;
}

export interface LatencyBreakdown {
  neural_inference_ms: number;
  osm_infrastructure_ms: number;
  rescue_report_ms: number;
  total_pipeline_ms: number;
  total_seconds: number;
}

export interface OfficerQueryResponse {
  scenario_id: string;
  query: string;
  language: Language;
  response_text: string;
  focused_id?: string;
  grounding: GroundingItem[];
  neural_segmentation: {
    hazard_type: string;
    neural_model: string;
    pixels_segmented: number;
    total_area_km2: number;
    mean_confidence: number;
    generated_polygon: [number, number][];
    inference_latency_ms: number;
  };
  field_infrastructure: FieldInfrastructure;
  rescue_report: RescueReport;
  latency_breakdown: LatencyBreakdown;
}

export interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  grounding?: GroundingItem[];
  rescue_report?: RescueReport;
  latency?: LatencyBreakdown;
  suggested_queries?: string[];
}

export interface SpectralIndex {
  id: string;
  name: string;
  formula: string;
  sensor_bands: string;
  description: string;
  color_ramp: string[];
  labels: string[];
  mean_value: number;
  histogram: number[];
}
