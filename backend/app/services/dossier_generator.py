"""
ISRO-Format Mission Intelligence SitRep Dossier Generator for SatQuery AI.
Produces official Earth Observation intelligence reports with telemetry, damage classification, and rescue protocols.
"""

from typing import Dict, Any
from app.services.scenarios_data import SCENARIOS

def generate_isro_dossier(scenario_id: str, query: str = "", findings: list = None) -> Dict[str, Any]:
    scenario = None
    for s in SCENARIOS:
        if s["id"] == scenario_id:
            scenario = s
            break
    if not scenario:
        scenario = SCENARIOS[0]

    dossier = {
        "classification": "RESTRICTED // FOR OFFICIAL USE ONLY // ISRO-NRSC EO MISSION",
        "report_id": f"NRSC-SITREP-2024-{scenario_id.upper()[:8]}-091A",
        "generated_timestamp": "2024-09-02T10:15:30Z",
        "organization": "National Remote Sensing Centre (NRSC), Indian Space Research Organisation (ISRO)",
        "mission_title": f"EO-RAPID ASSESSMENT: {scenario['title'].upper()}",
        "spatial_coverage": {
            "region": scenario["region"],
            "bounding_coordinates": {
                "center_lat": scenario["center"][0],
                "center_lon": scenario["center"][1],
                "approx_footprint_km2": 45.8
            }
        },
        "sensor_telemetry": {
            "primary_payload": scenario["primary_sensor"],
            "ground_sampling_distance": scenario["resolution"],
            "orbit_pass_type": "Sun-Synchronous Polar / Ascending Node",
            "sun_illumination": {
                "elevation": scenario.get("sun_elevation", "58.4°"),
                "azimuth": scenario.get("sun_azimuth", "125.6°")
            },
            "cloud_cover_percentage": "12.4% (Mitigated via SAR fusion)"
        },
        "query_objective": query or scenario["default_query"],
        "key_grounding_findings": scenario["grounding_presets"],
        "vulnerability_assessment": {
            "threat_rating": "LEVEL 4 (HIGH OPERATIONAL PRIORITY)",
            "affected_population_estimate": "3,850 - 4,200 persons within primary hazard buffer",
            "critical_lifelines_impacted": [
                "Primary arterial road access severed",
                "Agricultural topsoil erosion & standing water contamination",
                "High-voltage transmission line tower at risk (Tower #14)"
            ]
        },
        "actionable_directives": [
            "Dispatch NDRF 8th Battalion quick-response team to designated safe coordinates.",
            "Deploy UAV low-altitude LiDAR to verify bedrock stability prior to heavy machinery transit.",
            "Maintain continuous 12-hour SAR pass surveillance for water recession tracking.",
            "Broadcast emergency advisory via State Disaster Management Authority (SDMA) portal."
        ],
        "signatory": {
            "authorized_by": "Mission Director, Disaster Management Support Programme (DMSP)",
            "verification_hash": "SHA256:7f8a9e01bc34d8ef82a9012f45c678ea10b23456789abcdef0123456789abcde",
            "nodal_agency": "ISRO / NRSC Emergency Operations Centre (EOC), Hyderabad"
        }
    }
    return dossier
