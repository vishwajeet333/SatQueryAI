"""
Emergency Rescue Report & Incident Action Plan Generator.
Generates publication-ready disaster operational briefings for NDRF / SDRF commanders
with verified OpenStreetMap infrastructure, neural hazard telemetry, and multilingual translations.
"""

from typing import Dict, Any, List, Optional
import time
from datetime import datetime
from app.services.scenarios_data import SCENARIOS
from app.services.field_context import get_field_infrastructure

def generate_rescue_report(
    scenario_id: str,
    query: str = "",
    findings: Optional[List[Dict[str, Any]]] = None,
    language: str = "en"
) -> Dict[str, Any]:
    """
    Synthesize operational rescue report in under 10 seconds.
    Supports English ('en'), Hindi ('hi'), and Malayalam ('ml').
    """
    start_time = time.perf_counter()
    scenario = next((s for s in SCENARIOS if s["id"] == scenario_id), SCENARIOS[0])
    infra = get_field_infrastructure(scenario_id)["infrastructure"]
    grounding = findings or scenario.get("grounding_presets", [])
    
    total_hazard_area = sum(item.get("area_km2", 0) for item in grounding if item.get("threat_level") == "CRITICAL")
    critical_hazards = [g for g in grounding if g.get("threat_level") == "CRITICAL"]
    safe_zones = [g for g in grounding if g.get("threat_level") == "SAFE"]

    report_id = f"NDRF-IAP-{datetime.now().strftime('%Y%m%d')}-{scenario_id[:6].upper()}"
    timestamp = datetime.now().strftime("%d-%b-%Y %H:%M:%S IST")

    # Multilingual Headers & Directives
    if language == "hi":
        title = f"राष्ट्रीय आपदा प्रतिक्रिया बल (NDRF) - आपातकालीन बचाव कार्य योजना"
        briefing = (
            f"स्थान: {scenario['region']}। "
            f"उपग्रह अवलोकन ({scenario['primary_sensor']}) से पुष्टि होती है कि {total_hazard_area:.2f} वर्ग किमी क्षेत्र गंभीर रूप से प्रभावित है। "
            f"मुख्य संपर्क मार्ग क्षतिग्रस्त हो चुके हैं। राहत दलों को तत्काल सुरक्षित हेलीपैड और प्राथमिक चिकित्सा केंद्रों से संचालित किया जाए।"
        )
        action_header = "तत्काल प्राथमिकता निर्देश (Immediate Directives)"
        directives = [
            "मुंडक्कई/चुंगथांग में फंसे नागरिकों के लिए त्वरित हेलीकॉप्टर एयरलिफ्ट प्रारंभ करें।",
            "टूटे हुए नदी पुल के स्थान पर भारतीय सेना द्वारा बेली ब्रिज (Bailey Bridge) स्थापित करें।",
            "निकटतम स्वास्थ्य केंद्र में आपातकालीन ट्रॉमा बेड सक्रिय करें।"
        ]
    elif language == "ml":
        title = f"ദേശീയ ദുരന്ത നിവാരണ സേന (NDRF) - അടിയന്തര രക്ഷാപ്രവർത്തന റിപ്പോർട്ട്"
        briefing = (
            f"പ്രദേശം: {scenario['region']}। "
            f"ഉപഗ്രഹ വിവരങ്ങൾ പ്രകാരം {total_hazard_area:.2f} ചതുരശ്ര കിലോമീറ്റർ പ്രദേശം അതിഗുരുതരമായി ബാധിക്കപ്പെട്ടിരിക്കുന്നു. "
            f"ചൂരൽമല പാലം തകർന്നതിനാൽ മുണ്ടക്കൈ ഒറ്റപ്പെട്ടിരിക്കുന്നു. മേപ്പാടിയിലെ ഹെലിപാഡ് മുഖേന അടിയന്തര രക്ഷാപ്രവർത്തനം നടത്തുക."
        )
        action_header = "അടിയന്തര നിർദ്ദേശങ്ങൾ (Immediate Directives)"
        directives = [
            "മുണ്ടക്കൈയിൽ കുടുങ്ങിയവർക്കായി എയർഫോഴ്സ് എയർലിഫ്റ്റ് അടിയന്തരമായി സജ്ജമാക്കുക.",
            "ചൂരൽമലയിൽ സൈന്യത്തിന്റെ നേതൃത്വത്തിൽ ബെയ്ലി പാലം നിർമ്മിക്കുക.",
            "മേപ്പാടി പ്രാഥമിക ആരോഗ്യ കേന്ദ്രത്തിൽ ട്രോമ കെയർ കിടക്കകൾ ഒരുക്കുക."
        ]
    else:
        title = f"NDRF / SDRF Field Incident Action Plan (Rescue Report)"
        briefing = (
            f"Operational Zone: {scenario['region']}. "
            f"Satellite sensor telemetry ({scenario['primary_sensor']}) verifies {total_hazard_area:.2f} km² of critical disaster footprint. "
            f"Primary road artery severed. Immediate air-bridge and Bailey bridge deployment required to extract trapped civilian population."
        )
        action_header = "Immediate Tactical Directives"
        directives = [
            f"Deploy NDRF Swift Water / Mountain Rescue Battalion to {scenario['region']}.",
            f"Construct emergency 110ft Bailey Bridge at severed bridge crossing coordinates {infra['blocked_routes'][0]['coordinates'][0]}.",
            f"Establish forward medical casualty clearing post at {infra['hospitals'][0]['name']} (Capacity: {infra['hospitals'][0]['beds_available']} beds).",
            f"Maintain clear flight corridor to designated heli-base: {infra['safe_staging_zones'][0]['name']}."
        ]

    generation_time_ms = round((time.perf_counter() - start_time) * 1000, 2)

    return {
        "report_id": report_id,
        "language": language,
        "title": title,
        "timestamp": timestamp,
        "mission_title": scenario["title"],
        "region": scenario["region"],
        "primary_sensor": scenario["primary_sensor"],
        "executive_briefing": briefing,
        "severity_summary": {
            "critical_hazard_area_km2": round(total_hazard_area, 2),
            "critical_hazard_count": len(critical_hazards),
            "safe_zone_count": len(safe_zones),
            "overall_status": "RED ALERT - DISASTER RESPONSE LEVEL-3"
        },
        "critical_hazards": critical_hazards,
        "blocked_infrastructure": infra.get("blocked_routes", []),
        "designated_hospitals": infra.get("hospitals", []),
        "safe_staging_zones": infra.get("safe_staging_zones", []),
        "action_directives": directives,
        "generation_latency_seconds": round(generation_time_ms / 1000, 3)
    }
