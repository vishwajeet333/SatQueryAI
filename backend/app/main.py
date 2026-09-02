"""
SatQuery AI - Vision-Language Remote Sensing Assistant API
SIH 2024 Problem Statement ID: 26167
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
from app.services.dossier_generator import generate_isro_dossier

app = FastAPI(
    title="SatQuery AI - Multimodal Remote Sensing Assistant",
    description="Vision-Language AI platform for Earth Observation analysis, visual grounding, SAR-optical fusion, and ISRO intelligence briefs.",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    scenario_id: str
    query: str
    active_sensor: Optional[str] = "Cartosat-3"
    selected_bands: Optional[List[str]] = None
    api_key: Optional[str] = None
    ai_provider: Optional[str] = "gemini"

class DossierRequest(BaseModel):
    scenario_id: str
    query: Optional[str] = ""
    findings: Optional[List[Dict[str, Any]]] = None

@app.get("/")
def root():
    return {
        "status": "online",
        "app": "SatQuery AI",
        "sih_problem_id": "26167",
        "version": "1.0.0"
    }

@app.get("/api/health")
def health():
    return {"status": "healthy", "service": "satquery-ai-backend"}

@app.get("/api/scenarios")
def get_scenarios():
    return {"scenarios": SCENARIOS}

@app.get("/api/scenarios/{scenario_id}")
def get_scenario(scenario_id: str):
    scenario = get_scenario_by_id(scenario_id)
    return {"scenario": scenario}

@app.post("/api/query")
def execute_query(req: QueryRequest):
    try:
        result = process_sat_query(
            scenario_id=req.scenario_id,
            query=req.query,
            active_sensor=req.active_sensor,
            selected_bands=req.selected_bands,
            api_key=req.api_key,
            ai_provider=req.ai_provider
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/band-math")
def list_indices():
    return {"indices": get_all_indices()}

@app.get("/api/band-math/{index_name}")
def get_index_details(index_name: str):
    return {"index": get_band_math_info(index_name)}

@app.get("/api/temporal/{scenario_id}")
def get_temporal_analysis(scenario_id: str):
    data = analyze_temporal_change(scenario_id)
    return {"scenario_id": scenario_id, "temporal_analysis": data}

@app.get("/api/sar-fusion/{sensor_name}")
def get_sar_info(sensor_name: str = "RISAT-1A"):
    return {"profile": get_sar_fusion_profile(sensor_name)}

@app.post("/api/dossier")
def create_dossier(req: DossierRequest):
    dossier = generate_isro_dossier(req.scenario_id, req.query, req.findings)
    return {"dossier": dossier}

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
    
    geojson_doc = {
        "type": "FeatureCollection",
        "crs": {"type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84"}},
        "features": features
    }
    return geojson_doc
