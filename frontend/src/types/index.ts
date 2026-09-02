export interface GroundingItem {
  id: string;
  label: string;
  type: 'polygon' | 'polyline' | 'point';
  color: string;
  coordinates: [number, number][];
  area_km2?: number;
  confidence: number;
  spectral_index?: string;
  threat_level?: string;
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

export interface ReasoningStep {
  step: number;
  title: string;
  detail: string;
  status: 'completed' | 'running' | 'pending';
  badge: string;
}

export interface QueryResponse {
  scenario_id: string;
  query: string;
  response_text: string;
  reasoning_steps: ReasoningStep[];
  grounding: GroundingItem[];
  metrics: {
    total_area_km2: number;
    confidence_score: number;
    features_detected: number;
    spatial_resolution: string;
    primary_sensor: string;
  };
  suggested_queries: string[];
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

export interface TemporalTransition {
  from_class: string;
  to_class: string;
  area_ha: number;
  pct: string;
}

export interface TemporalAnalysis {
  pre_date: string;
  post_date: string;
  event_type: string;
  overall_damage_severity: string;
  area_displaced_km2: number;
  metrics: Record<string, any>;
  land_cover_transition: TemporalTransition[];
}

export interface DossierData {
  classification: string;
  report_id: string;
  generated_timestamp: string;
  organization: string;
  mission_title: string;
  spatial_coverage: {
    region: string;
    bounding_coordinates: {
      center_lat: number;
      center_lon: number;
      approx_footprint_km2: number;
    };
  };
  sensor_telemetry: {
    primary_payload: string;
    ground_sampling_distance: string;
    orbit_pass_type: string;
    sun_illumination: {
      elevation: string;
      azimuth: string;
    };
    cloud_cover_percentage: string;
  };
  query_objective: string;
  key_grounding_findings: GroundingItem[];
  vulnerability_assessment: {
    threat_rating: string;
    affected_population_estimate: string;
    critical_lifelines_impacted: string[];
  };
  actionable_directives: string[];
  signatory: {
    authorized_by: string;
    verification_hash: string;
    nodal_agency: string;
  };
}
