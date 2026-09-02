"""
Preset Earth Observation missions and Indian satellite telemetry for SatQuery AI.
Includes Cartosat-3, Resourcesat-2A, RISAT-1A SAR, INSAT-3DR, and NISAR simulation.
"""

SCENARIOS = [
    {
        "id": "scenario_uttarakhand",
        "title": "Uttarakhand Cloudburst & Landslide Inundation",
        "region": "Chamoli / Joshimath Valley, Uttarakhand",
        "center": [30.5526, 79.5660],
        "zoom": 13,
        "primary_sensor": "Cartosat-3 (PAN + MX)",
        "resolution": "0.28m GSD",
        "acquisition_date": "2024-08-14 05:42 UTC",
        "sun_elevation": "61.4°",
        "sun_azimuth": "138.2°",
        "description": "Flash flood & debris flow along Rishiganga and Alaknanda tributaries triggered by intense convective rainfall over glacial moraines.",
        "tags": ["Disaster", "Landslide", "Cartosat-3", "DEM Slope"],
        "layers": {
            "optical": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80",
            "fcc": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80",
            "sar": "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=80",
            "ndvi_overlay": "linear-gradient(135deg, rgba(34,197,94,0.6), rgba(234,179,8,0.4), rgba(239,68,68,0.7))",
            "pre_event_date": "2024-07-20",
            "post_event_date": "2024-08-14"
        },
        "default_query": "Identify high-risk landslide scarps along steep slopes and highlight blocked road networks with estimated debris volume.",
        "grounding_presets": [
            {
                "id": "g1",
                "label": "Active Landslide Scarp & Debris Fan",
                "type": "polygon",
                "color": "#ef4444",
                "coordinates": [
                    [30.559, 79.560],
                    [30.564, 79.569],
                    [30.556, 79.574],
                    [30.550, 79.566]
                ],
                "area_km2": 1.42,
                "confidence": 0.964,
                "spectral_index": "BAI: 0.78, Slope: 41°",
                "threat_level": "CRITICAL",
                "details": "Major mass wasting scarp with unconsolidated morainic debris deposit extending 1,850m downslope."
            },
            {
                "id": "g2",
                "label": "Severed NH-7 Highway Segment",
                "type": "polyline",
                "color": "#f59e0b",
                "coordinates": [
                    [30.548, 79.561],
                    [30.551, 79.565],
                    [30.554, 79.568]
                ],
                "area_km2": 0.18,
                "confidence": 0.981,
                "spectral_index": "NDVI drop: -0.62",
                "threat_level": "HIGH",
                "details": "320m stretch of National Highway 7 completely buried under 4.2m of boulders and mud."
            },
            {
                "id": "g3",
                "label": "Stable Helipad & Staging Ground",
                "type": "polygon",
                "color": "#10b981",
                "coordinates": [
                    [30.545, 79.552],
                    [30.549, 79.555],
                    [30.547, 79.559],
                    [30.543, 79.556]
                ],
                "area_km2": 0.35,
                "confidence": 0.945,
                "spectral_index": "Slope < 4°, DEM: 1890m",
                "threat_level": "SAFE",
                "details": "NDRF primary airdrop and relief staging node on solid rock terrace."
            }
        ]
    },
    {
        "id": "scenario_godavari",
        "title": "Godavari Basin Flood Inundation & SAR Cloud Penetration",
        "region": "Rajahmundry & Konaseema, Andhra Pradesh",
        "center": [16.9890, 81.7840],
        "zoom": 12,
        "primary_sensor": "RISAT-1A (C-band SAR) + Resourcesat-2A",
        "resolution": "3.0m Stripmap",
        "acquisition_date": "2024-07-28 18:15 UTC",
        "sun_elevation": "N/A (Radar Night Pass)",
        "sun_azimuth": "Descending Pass (284°)",
        "description": "Severe monsoon surge causing embankment overflow. Heavy 100% stratus cloud cover penetrated via SAR VV/VH dual polarization backscatter.",
        "tags": ["SAR", "Flood", "RISAT-1A", "Cloud-Penetration", "Agriculture"],
        "layers": {
            "optical": "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=80",
            "fcc": "https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?auto=format&fit=crop&w=1600&q=80",
            "sar": "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1600&q=80",
            "ndvi_overlay": "linear-gradient(135deg, rgba(59,130,246,0.7), rgba(16,185,129,0.4), rgba(239,68,68,0.7))",
            "pre_event_date": "2024-07-10",
            "post_event_date": "2024-07-28"
        },
        "default_query": "Penetrate monsoon cloud cover using RISAT-1A SAR VV/VH backscatter and segment all submerged paddy fields and marooned villages.",
        "grounding_presets": [
            {
                "id": "g201",
                "label": "Submerged Paddy Agriculture (Specular Low Backscatter)",
                "type": "polygon",
                "color": "#3b82f6",
                "coordinates": [
                    [16.975, 81.765],
                    [17.005, 81.775],
                    [16.995, 81.810],
                    [16.965, 81.795]
                ],
                "area_km2": 18.75,
                "confidence": 0.982,
                "spectral_index": "SAR σ0 (VV): -22.4 dB, NDWI: +0.74",
                "threat_level": "CRITICAL",
                "details": "Extensive standing water depth exceeding 1.2m over 1,875 hectares of paddy."
            },
            {
                "id": "g202",
                "label": "Marooned Habitation Island (Isolated Settlement)",
                "type": "polygon",
                "color": "#ec4899",
                "coordinates": [
                    [16.985, 81.782],
                    [16.992, 81.786],
                    [16.989, 81.794],
                    [16.981, 81.789]
                ],
                "area_km2": 0.62,
                "confidence": 0.957,
                "spectral_index": "Double-bounce Corner Reflectance",
                "threat_level": "EMERGENCY",
                "details": "Appx 2,400 residents isolated with breached access roads. Immediate boat evacuation corridor required."
            },
            {
                "id": "g203",
                "label": "Intact Flood Protection Bund",
                "type": "polyline",
                "color": "#10b981",
                "coordinates": [
                    [16.960, 81.750],
                    [16.970, 81.770],
                    [16.980, 81.800]
                ],
                "area_km2": 0.45,
                "confidence": 0.973,
                "spectral_index": "Elevation crest +3.8m MSL",
                "threat_level": "MONITORED",
                "details": "Engineered revetment holding water level with 0.8m freeboard margin."
            }
        ]
    },
    {
        "id": "scenario_punjab",
        "title": "Punjab Stubble Burning & Aerosol Thermal Hotspots",
        "region": "Sangrur & Patiala districts, Punjab",
        "center": [30.2450, 75.8420],
        "zoom": 12,
        "primary_sensor": "INSAT-3DR (TIR 1 & 2) + Resourcesat-2A LISS-IV",
        "resolution": "5.8m (Optical) / 1km (Thermal)",
        "acquisition_date": "2024-11-04 09:30 UTC",
        "sun_elevation": "44.2°",
        "sun_azimuth": "162.8°",
        "description": "Post-monsoon Kharif paddy residue combustion tracking. Brightness temperature anomalies combined with Burn Area Index (BAI).",
        "tags": ["Agriculture", "Thermal-IR", "INSAT-3DR", "Air-Quality", "Aerosol"],
        "layers": {
            "optical": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80",
            "fcc": "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80",
            "sar": "https://images.unsplash.com/photo-1516214104703-d870798883c5?auto=format&fit=crop&w=1600&q=80",
            "ndvi_overlay": "linear-gradient(135deg, rgba(239,68,68,0.8), rgba(249,115,22,0.6), rgba(34,197,94,0.3))",
            "pre_event_date": "2024-10-20",
            "post_event_date": "2024-11-04"
        },
        "default_query": "Detect active stubble fire coordinates using Middle-Infrared thermal anomalies and quantify newly burnt acreage.",
        "grounding_presets": [
            {
                "id": "g301",
                "label": "Active Fire Front & Thermal Anomaly (TIR)",
                "type": "polygon",
                "color": "#ef4444",
                "coordinates": [
                    [30.238, 75.830],
                    [30.252, 75.838],
                    [30.248, 75.855],
                    [30.232, 75.845]
                ],
                "area_km2": 3.84,
                "confidence": 0.988,
                "spectral_index": "BT (3.9µm): 338.4 K, ΔBT: +14.2 K",
                "threat_level": "SEVERE",
                "details": "Active flaming front with high PM2.5/PM10 emission rate (est. 480 kg/hr)."
            },
            {
                "id": "g302",
                "label": "Fresh Ash & Charred Crop Residue (BAI High)",
                "type": "polygon",
                "color": "#78716c",
                "coordinates": [
                    [30.250, 75.850],
                    [30.260, 75.860],
                    [30.255, 75.875],
                    [30.242, 75.865]
                ],
                "area_km2": 5.12,
                "confidence": 0.952,
                "spectral_index": "BAI: 0.89, NBR: -0.54",
                "threat_level": "MEDIUM",
                "details": "Charred field parcel burned within last 18 hours with complete organic topsoil degradation."
            }
        ]
    },
    {
        "id": "scenario_kutch",
        "title": "Gulf of Kutch Maritime Vessel & Strategic Creek Defense",
        "region": "Sir Creek & Kandla Port Approach, Gujarat",
        "center": [22.8500, 69.8500],
        "zoom": 12,
        "primary_sensor": "Cartosat-3 (0.28m PAN) + RISAT-1A SAR",
        "resolution": "0.28m / 1.0m Spotlight SAR",
        "acquisition_date": "2024-09-02 04:10 UTC",
        "sun_elevation": "52.8°",
        "sun_azimuth": "112.4°",
        "description": "High-resolution coastal surveillance, unregistered fishing boat wake detection, and critical channel monitoring.",
        "tags": ["Defense", "Maritime", "Cartosat-3", "Ship-Detection", "SAR"],
        "layers": {
            "optical": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80",
            "fcc": "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1600&q=80",
            "sar": "https://images.unsplash.com/photo-1498084393753-b411b2d26b34?auto=format&fit=crop&w=1600&q=80",
            "ndvi_overlay": "linear-gradient(135deg, rgba(14,165,233,0.7), rgba(99,102,241,0.5), rgba(244,63,94,0.7))",
            "pre_event_date": "2024-08-20",
            "post_event_date": "2024-09-02"
        },
        "default_query": "Identify all unauthorized motorized watercraft traversing within the 5 nautical mile exclusive security zone.",
        "grounding_presets": [
            {
                "id": "g401",
                "label": "High-Speed Interceptor Craft (Moving Target)",
                "type": "polygon",
                "color": "#f43f5e",
                "coordinates": [
                    [22.842, 69.838],
                    [22.846, 69.840],
                    [22.844, 69.844],
                    [22.840, 69.842]
                ],
                "area_km2": 0.04,
                "confidence": 0.991,
                "spectral_index": "Kelvin Wake Angle: 19.5°, Speed: 24 kts",
                "threat_level": "WARNING",
                "details": "22m fast patrol hull displacing prominent turbulent hydrodynamic wake heading 045°."
            },
            {
                "id": "g402",
                "label": "Commercial VLCC Tanker Berth",
                "type": "polygon",
                "color": "#38bdf8",
                "coordinates": [
                    [22.860, 69.865],
                    [22.875, 69.870],
                    [22.872, 69.882],
                    [22.857, 69.877]
                ],
                "area_km2": 0.85,
                "confidence": 0.997,
                "spectral_index": "Radar RCS: +42 dBm²",
                "threat_level": "NORMAL",
                "details": "310m crude carrier moored at Single Point Mooring (SPM-2)."
            }
        ]
    },
    {
        "id": "scenario_bengaluru",
        "title": "Bengaluru Wetland Encroachment & Urban Heat Island",
        "region": "Bellandur & Varthur Lake Catchment, Karnataka",
        "center": [12.9350, 77.6850],
        "zoom": 13,
        "primary_sensor": "Resourcesat-2A (LISS-IV) Multi-Temporal",
        "resolution": "5.8m Multispectral",
        "acquisition_date": "2024-05-18 05:15 UTC",
        "sun_elevation": "68.9°",
        "sun_azimuth": "104.2°",
        "description": "6-year multi-temporal analysis (2018 vs 2024) revealing 43% wetland loss due to concrete impervious surface expansion and buffer zone encroachment.",
        "tags": ["Urban", "Temporal-Change", "NDBI", "Wetland", "Resourcesat"],
        "layers": {
            "optical": "https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=1600&q=80",
            "fcc": "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=1600&q=80",
            "sar": "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1600&q=80",
            "ndvi_overlay": "linear-gradient(135deg, rgba(234,88,12,0.8), rgba(234,179,8,0.5), rgba(16,185,129,0.4))",
            "pre_event_date": "2018-04-12",
            "post_event_date": "2024-05-18"
        },
        "default_query": "Quantify total wetland buffer zone conversion into concrete built-up area between 2018 and 2024.",
        "grounding_presets": [
            {
                "id": "g501",
                "label": "Illegal Land Reclamation in Lake Buffer (NDBI Spike)",
                "type": "polygon",
                "color": "#ea580c",
                "coordinates": [
                    [12.932, 77.678],
                    [12.940, 77.685],
                    [12.936, 77.698],
                    [12.928, 77.689]
                ],
                "area_km2": 2.14,
                "confidence": 0.976,
                "spectral_index": "NDBI: +0.48 (Built-up), SAVI drop: -58%",
                "threat_level": "VIOLATION",
                "details": "Encroached 75m statutory green buffer with asphalt and concrete commercial footprint."
            },
            {
                "id": "g502",
                "label": "Hyper-Eutrophic Water Body (Algal Bloom / Hyacinth)",
                "type": "polygon",
                "color": "#10b981",
                "coordinates": [
                    [12.939, 77.688],
                    [12.944, 77.696],
                    [12.940, 77.702],
                    [12.935, 77.694]
                ],
                "area_km2": 1.78,
                "confidence": 0.963,
                "spectral_index": "NDRE: 0.62, Dissolved Oxygen: < 1.2 mg/L",
                "threat_level": "ECOLOGICAL_HAZARD",
                "details": "Complete surface weed coverage preventing sunlight penetration and gas exchange."
            }
        ]
    }
]
