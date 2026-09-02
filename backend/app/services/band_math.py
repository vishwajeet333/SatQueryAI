"""
Spectral Band Math Engine for Satellite Remote Sensing.
Provides formulas, color ramps, index descriptions, and raster histogram statistics.
"""

from typing import Dict, Any, List

SPECTRAL_INDICES = {
    "NDVI": {
        "name": "Normalized Difference Vegetation Index",
        "formula": "(NIR - Red) / (NIR + Red)",
        "sensor_bands": "Band 4 (NIR: 842nm) & Band 3 (Red: 665nm)",
        "description": "Quantifies vegetation health, chlorophyll density, and canopy biomass. Range: -1.0 (water/barren) to +1.0 (dense canopy).",
        "color_ramp": ["#8b5a2b", "#d4b16a", "#e6f598", "#66c2a5", "#1a9850", "#006837"],
        "labels": ["Barren / Water", "Sparse", "Moderate", "Dense Canopy"],
        "mean_value": 0.68,
        "histogram": [4, 12, 18, 35, 78, 120, 195, 240, 180, 95]
    },
    "NDWI": {
        "name": "Normalized Difference Water Index",
        "formula": "(Green - NIR) / (Green + NIR)",
        "sensor_bands": "Band 2 (Green: 560nm) & Band 4 (NIR: 842nm)",
        "description": "Delineates open water bodies, flood inundation extents, and wetland moisture content while eliminating soil noise.",
        "color_ramp": ["#f7fbff", "#c6dbef", "#6baed6", "#2171b5", "#08306b"],
        "labels": ["Dry Soil", "Moist Soil", "Shallow Water", "Deep Inundation"],
        "mean_value": 0.42,
        "histogram": [85, 140, 90, 45, 60, 110, 180, 210, 160, 80]
    },
    "NDBI": {
        "name": "Normalized Difference Built-up Index",
        "formula": "(SWIR - NIR) / (SWIR + NIR)",
        "sensor_bands": "Band 6 (SWIR: 1610nm) & Band 4 (NIR: 842nm)",
        "description": "Highlights impervious surfaces, concrete infrastructure, asphalt, and urban encroachment into natural ecosystems.",
        "color_ramp": ["#31a354", "#addd8e", "#fec44f", "#d95f0e", "#990000"],
        "labels": ["Vegetation / Water", "Bare Soil", "Suburban", "High-Density Concrete"],
        "mean_value": 0.31,
        "histogram": [110, 145, 180, 130, 95, 70, 85, 120, 90, 40]
    },
    "BAI": {
        "name": "Burn Area Index",
        "formula": "1 / ((0.1 - Red)^2 + (0.06 - NIR)^2)",
        "sensor_bands": "Band 3 (Red) & Band 4 (NIR)",
        "description": "Specifically engineered to detect charcoal and ash deposits in post-fire burn scars and stubble burn regions.",
        "color_ramp": ["#2b83ba", "#abdda4", "#ffffbf", "#fdae61", "#d7191c"],
        "labels": ["Unburned", "Low Severity", "Moderate Burn", "High Ash Severity"],
        "mean_value": 0.74,
        "histogram": [150, 120, 80, 40, 60, 95, 140, 190, 210, 175]
    },
    "NDRE": {
        "name": "Normalized Difference Red Edge",
        "formula": "(NIR - RedEdge) / (NIR + RedEdge)",
        "sensor_bands": "Band 5 (RedEdge: 705nm) & Band 7 (NIR)",
        "description": "Sensitive to chlorophyll variations in mid-to-late season crops and aquatic algal blooms without saturation.",
        "color_ramp": ["#e0f3f8", "#91bfdb", "#4575b4", "#fee090", "#fc8d59"],
        "labels": ["Low Chlorophyll", "Moderate", "Optimal Health", "Severe Eutrophication"],
        "mean_value": 0.59,
        "histogram": [30, 65, 110, 160, 210, 190, 140, 95, 60, 25]
    }
}

def get_band_math_info(index_name: str) -> Dict[str, Any]:
    return SPECTRAL_INDICES.get(index_name.upper(), SPECTRAL_INDICES["NDVI"])

def get_all_indices() -> List[Dict[str, Any]]:
    return [{"id": k, **v} for k, v in SPECTRAL_INDICES.items()]
