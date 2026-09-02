"""
SatQuery AI - Multimodal Field Officer AI Copilot API
SIH Problem Statement ID: 26167 | ISRO / Disaster Field Copilot
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

from app.services.scenarios_data import SCENARIOS
from app.services.geo_engine import process_sat_query, get_scenario_by_id
from app.services.band_math import get_all_indices, get_band_math_info
from app.services.temporal_engine import analyze_temporal_change
from app.services.sar_fusion import get_sar_fusion_profile
from app.services.neural_segmentation import neural_segmenter
from app.services.field_context import get_field_infrastructure
from app.services.rescue_report_generator import generate_rescue_report
from app.services.query_orchestrator import orchestrate_officer_query

app = FastAPI(
    title="SatQuery AI - Disaster Field Officer Copilot API",
    description="Vision-Language AI Copilot for NDRF / SDRF field officers, hazard U-Net segmentation, OpenStreetMap infrastructure, and emergency rescue action plans.",
    version="2.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class OfficerQueryRequest(BaseModel):
    scenario_id: str
    query: str
    language: Optional[str] = "en"
    api_key: Optional[str] = None

class RescueReportRequest(BaseModel):
    scenario_id: str
    query: Optional[str] = ""
    findings: Optional[List[Dict[str, Any]]] = None
    language: Optional[str] = "en"

class SegmentationRequest(BaseModel):
    center_lat: float
    center_lng: float
    hazard_type: Optional[str] = "landslide"
    resolution_meters: Optional[float] = 10.0

@app.get("/")
def root():
    return {
        "status": "online",
        "app": "SatQuery AI Field Officer Copilot",
        "sih_problem_id": "26167",
        "version": "2.0.0",
        "active_disasters": ["2024 Wayanad Landslide", "2023 Sikkim GLOF Flood"]
    }

@app.get("/api/health")
def health():
    return {
        "status": "healthy",
        "service": "satquery-ai-field-copilot",
        "neural_engine": "U-Net EO-Seg v2.4",
        "mode": "edge-offline-ready"
    }

@app.get("/api/scenarios")
def get_scenarios():
    return {"scenarios": SCENARIOS}

@app.get("/api/scenarios/{scenario_id}")
def get_scenario(scenario_id: str):
    scenario = get_scenario_by_id(scenario_id)
    return {"scenario": scenario}

@app.post("/api/officer/query")
def officer_query_endpoint(req: OfficerQueryRequest):
    """
    Primary Officer Entry Point: Routes natural language query to U-Net neural segmentation,
    OSM road topology lookup, map overlays, and sub-10s Incident Action Plan.
    """
    try:
        result = orchestrate_officer_query(
            scenario_id=req.scenario_id,
            query=req.query,
            language=req.language or "en",
            api_key=req.api_key
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/officer/rescue-report")
def officer_rescue_report_endpoint(req: RescueReportRequest):
    """Generate official NDRF Emergency Rescue Action Plan in seconds."""
    try:
        report = generate_rescue_report(
            scenario_id=req.scenario_id,
            query=req.query or "",
            findings=req.findings,
            language=req.language or "en"
        )
        return {"rescue_report": report}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/officer/infrastructure/{scenario_id}")
def get_infrastructure(scenario_id: str):
    """Fetch OpenStreetMap road, bridge, and hospital nodes for disaster area."""
    return get_field_infrastructure(scenario_id)

@app.post("/api/officer/segmentation")
def run_segmentation(req: SegmentationRequest):
    """Run real U-Net neural segmentation inference pass on satellite coordinates."""
    result = neural_segmenter.segment_hazard(
        center_lat=req.center_lat,
        center_lng=req.center_lng,
        hazard_type=req.hazard_type or "landslide",
        resolution_meters=req.resolution_meters or 10.0
    )
    return result

# Backward-compatibility route for legacy queries
@app.post("/api/query")
def execute_query(req: OfficerQueryRequest):
    return officer_query_endpoint(req)

@app.post("/api/dossier")
def create_dossier(req: RescueReportRequest):
    return officer_rescue_report_endpoint(req)

@app.get("/api/band-math")
def list_indices():
    return {"indices": get_all_indices()}

@app.get("/api/temporal/{scenario_id}")
def get_temporal_analysis(scenario_id: str):
    data = analyze_temporal_change(scenario_id)
    return {"scenario_id": scenario_id, "temporal_analysis": data}

@app.get("/api/sar-fusion/{sensor_name}")
def get_sar_info(sensor_name: str = "RISAT-1A"):
    return {"profile": get_sar_fusion_profile(sensor_name)}

@app.get("/api/export-geojson/{scenario_id}")
def export_geojson(scenario_id: str):
    scenario = get_scenario_by_id(scenario_id)
    features = []
    for item in scenario.get("grounding_presets", []):
        coords = item["coordinates"]
        if item["type"] == "polygon":
            geojson_coords = [[c[1], c[0]] for c in coords]
            if geojson_coords[0] != geojson_coords[-1]:
                geojson_coords.append(geojson_coords[0])
            geom = {"type": "Polygon", "coordinates": [geojson_coords]}
        else:
            geom = {"type": "LineString", "coordinates": [[c[1], c[0]] for c in coords]}
        
        features.append({
            "type": "Feature",
            "properties": {
                "id": item["id"],
                "label": item["label"],
                "area_km2": item.get("area_km2"),
                "confidence": item.get("confidence"),
                "spectral_index": item.get("spectral_index"),
                "threat_level": item.get("threat_level"),
                "details": item.get("details")
            },
            "geometry": geom
        })
    
    return {
        "type": "FeatureCollection",
        "crs": {"type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84"}},
        "features": features
    }
