"""
SAR Polarimetric & Optical-Radar Cross-Spectral Fusion Engine (RISAT / Sentinel-1 / NISAR).
"""

from typing import Dict, Any

SAR_FUSION_DATA = {
    "RISAT-1A": {
        "sensor": "RISAT-1A (Radar Imaging Satellite-1A)",
        "frequency": "C-band (5.35 GHz)",
        "polarization_modes": ["VV", "VH", "HH", "HV", "Hybrid Pol (RH/RV)"],
        "speckle_filter": "Enhanced Lee Filter (7x7 window)",
        "penetration_capabilities": [
            "100% Monsoon Cloud & Smoke Penetration",
            "Nighttime all-weather illumination",
            "Dielectric moisture sensitivity (Surface soil vs open water)"
        ],
        "decomposition_type": "Cloude-Pottier & Freeman-Durden 3-Component",
        "scattering_mechanisms": {
            "surface_roughness_odd_bounce": "Water bodies / Smooth roads (-24 to -28 dB)",
            "volume_scattering": "Forest & dense vegetation (-12 to -16 dB)",
            "double_bounce_corner": "Buildings, ships & bridges (-4 to +6 dB)"
        }
    },
    "NISAR": {
        "sensor": "NASA-ISRO SAR (NISAR Simulation)",
        "frequency": "Dual L-band (1.25 GHz) & S-band (3.2 GHz)",
        "polarization_modes": ["Full Quad-Pol (HH+HV+VH+VV)"],
        "speckle_filter": "Refined Frost Filter (5x5 window)",
        "penetration_capabilities": [
            "Sub-canopy ground soil deformation",
            "Glacial ice-sheet velocity tracking (InSAR Coherence > 0.85)",
            "Deep biomass penetration up to 100 tons/ha"
        ],
        "decomposition_type": "H-Alpha Target Decomposition",
        "scattering_mechanisms": {
            "surface_roughness_odd_bounce": "Dry alluvium (-20 dB)",
            "volume_scattering": "Dense canopy (-8 dB)",
            "double_bounce_corner": "Urban settlement (+8 dB)"
        }
    }
}

def get_sar_fusion_profile(sensor_name: str = "RISAT-1A") -> Dict[str, Any]:
    return SAR_FUSION_DATA.get(sensor_name, SAR_FUSION_DATA["RISAT-1A"])
