"""
SatQuery AI - Multimodal Remote Sensing Vision-Language Assistant API
SIH 2026 Problem Statement ID: 26167 | ISRO Space Technology Theme
"""

from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

from app.services.scenarios_data import SCENARIOS
from app.services.geo_engine import get_scenario_by_id
from app.services.band_math import get_all_indices, get_band_math_info
from app.services.temporal_engine import analyze_temporal_change
from app.services.sar_fusion import get_sar_fusion_profile
from app.services.neural_segmentation import neural_segmenter
from app.services.field_context import get_field_infrastructure
from app.services.rescue_report_generator import generate_rescue_report
from app.services.raster_processor import parse_arbitrary_raster, validate_co_registration, UPLOADED_RASTER_REGISTRY
from app.services.agentic_controller import orchestrate_agentic_pipeline, get_model_registry
from app.services.benchmark_metrics import get_benchmark_scores

app = FastAPI(
    title="SatQuery AI - Agentic Remote Sensing VLM Assistant",
    description="Multimodal Vision-Language platform adapted on BigEarthNet-19 for arbitrary GeoTIFF analysis, VQA, REG grounding, bi-temporal change, SAR fusion, and auditable execution traces.",
    version="3.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AgentQueryRequest(BaseModel):
    query: str
    scenario_id: Optional[str] = "scenario_wayanad"
    raster_id_t1: Optional[str] = None
    raster_id_t2: Optional[str] = None
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
        "app": "SatQuery AI Remote Sensing Assistant",
        "sih_problem_id": "26167",
        "version": "3.0.0",
        "adapted_dataset": "BigEarthNet-19 Multi-Spectral",
        "supported_formats": ["GeoTIFF", "TIFF", "PNG", "JPEG"],
        "models_registered": len(get_model_registry())
    }

@app.get("/api/health")
def health():
    return {
        "status": "healthy",
        "service": "satquery-ai-agentic-backend",
        "neural_vlm": "BigEarthNet-VLM PyTorch Model",
        "model_registry_active": True
    }

@app.get("/api/models/registry")
def model_registry_endpoint():
    """Retrieve formal PyTorch model registry for SIH jury audit."""
    return {"models": get_model_registry()}

@app.get("/api/benchmarks")
def benchmarks_endpoint():
    """Retrieve verified benchmark scores for VRSBench, RSVQA, CDVQA, and BigEarthNet."""
    return get_benchmark_scores()

@app.post("/api/upload")
async def upload_raster_endpoint(
    file: UploadFile = File(...),
    modality: Optional[str] = Form("optical")
):
    """
    Arbitrary GeoTIFF / TIFF / PNG / JPEG upload endpoint.
    Validates CRS projection, multi-spectral band counts, GSD resolution, and prepares PyTorch tensors.
    """
    try:
        file_bytes = await file.read()
        metadata = parse_arbitrary_raster(
            file_bytes=file_bytes,
            filename=file.filename or "uploaded_raster.tif",
            modality=modality or "optical"
        )
        return {"status": "success", "metadata": metadata}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to process raster: {str(e)}")

@app.post("/api/agent/orchestrate")
def agent_orchestrate_endpoint(req: AgentQueryRequest):
    """
    Primary Agentic Controller: Dispatches natural language query to PyTorch model registry,
    runs neural tensor pass on uploaded/preset rasters, and emits the Auditable Execution Trace.
    """
    try:
        result = orchestrate_agentic_pipeline(
            query=req.query,
            scenario_id=req.scenario_id,
            raster_id_t1=req.raster_id_t1,
            raster_id_t2=req.raster_id_t2,
            language=req.language or "en",
            api_key=req.api_key
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Backward compatibility routes
@app.post("/api/officer/query")
def officer_query_endpoint(req: AgentQueryRequest):
    return agent_orchestrate_endpoint(req)

@app.post("/api/query")
def query_legacy_endpoint(req: AgentQueryRequest):
    return agent_orchestrate_endpoint(req)

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

@app.get("/api/scenarios")
def get_scenarios():
    return {"scenarios": SCENARIOS}

@app.get("/api/scenarios/{scenario_id}")
def get_scenario(scenario_id: str):
    scenario = get_scenario_by_id(scenario_id)
    return {"scenario": scenario}

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
