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

export interface ModelRegistryEntry {
  model_id: string;
  name: string;
  architecture: string;
  domain: string;
  input_modalities: string[];
  adapted_dataset: string;
  parameter_count: string;
  status: string;
}

export interface AuditableExecutionTrace {
  trace_id: string;
  task_selected: string;
  models_invoked: ModelRegistryEntry[] | any[];
  input_compatibility: {
    source: string;
    crs: string;
    channels: number;
    resolution_gsd: string;
    modality: string;
    format_valid: boolean;
  };
  co_registration_metrics: {
    co_registered: boolean;
    spatial_overlap_pct: number;
    crs_match: boolean;
  };
  neural_forward_params: {
    tensor_shape: number[];
    spectral_bands_utilized: string[];
    activation_threshold: number;
    device: string;
  };
  detected_bigearthnet_classes: Array<{ label: string; confidence: number }>;
  latency_profile: {
    input_validation_ms: number;
    neural_forward_ms: number;
    osm_topology_ms: number;
    report_generation_ms: number;
    total_pipeline_ms: number;
    total_seconds: number;
  };
}

export interface RasterMetadata {
  raster_id: string;
  filename: string;
  crs: string;
  channels: number;
  band_names: string[];
  dimensions: { height: number; width: number };
  resolution_meters: number;
  modality_detected: string;
  min_reflectance: number;
  max_reflectance: number;
  co_registered: boolean;
  parse_latency_ms: number;
}

export interface BenchmarkEntry {
  id: string;
  name: string;
  domain: string;
  metric: string;
  top1_accuracy?: string;
  map_score?: string;
  vqa_accuracy?: string;
  grounding_miou?: string;
  overall_accuracy?: string;
  change_f1_score?: string;
  status: string;
}

export interface BenchmarkData {
  evaluation_summary: {
    status: string;
    benchmark_count: number;
    overall_score: string;
    adaptation_status: string;
  };
  benchmarks: BenchmarkEntry[];
}

export interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  grounding?: GroundingItem[];
  rescue_report?: RescueReport;
  execution_trace?: AuditableExecutionTrace;
  latency?: LatencyBreakdown;
  suggested_queries?: string[];
}
