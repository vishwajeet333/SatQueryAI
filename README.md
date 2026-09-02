# SatQuery AI
### Multimodal Remote Sensing Vision-Language Assistant for Earth Observation

SatQuery AI is a multimodal Vision-Language Model (VLM) assistant designed for Earth Observation (EO) and satellite imagery analysis. It converts natural language queries into sub-pixel spatial polygon groundings (Referring Expression Grounding), cross-spectral band computations, SAR-optical fusion, and standardized situation reports.

---

## Core Capabilities

- **Referring Expression Grounding (REG)**: Natural language queries extract vector polygons, coordinate boundaries, damage footprints ($km^2$), and confidence metrics.
- **Optical-SAR Fusion**: Penetrates cloud cover and atmospheric distortion using dual-polarization Synthetic Aperture Radar (SAR) backscatter ($\sigma^0$ in dB) blended with multispectral optical tiles.
- **Dynamic Spectral Band Math**: Computes on-the-fly raster indices including NDVI (Vegetation), NDWI (Water), NDBI (Built-up), BAI (Burn Area), and NDRE (Red Edge Chlorophyll).
- **Bitemporal Change Detection**: Split-slider interface comparing pre- and post-event imagery to compute land-use transition matrices.
- **Automated Situation Reports (SitRep)**: Generates structured mission intelligence dossiers with solar angles, damage tables, evacuation paths, and SHA-256 verification seals.
- **Vector Interoperability**: Exports detected boundaries to GeoJSON, KML (Google Earth), and ESRI Shapefile-compatible formats for QGIS and ArcGIS.
- **Dual Inference Mode**: Operates offline using deterministic remote sensing reasoning or connects to live LLMs (Google Gemini / OpenAI) via API key.

---

## Architecture & Tech Stack

```
[ Frontend: React 19 + TypeScript + Vite + Tailwind CSS + Leaflet GIS ]
                             │  (HTTP / JSON REST)
                             ▼
[ Backend: FastAPI + Uvicorn + NumPy + Pydantic (Python 3.10+) ]
                             │
       ┌─────────────────────┼─────────────────────┐
       ▼                     ▼                     ▼
[ Geo-VLM Grounding ] [ Spectral Math ]  [ ISRO Mission Dossier ]
```

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Leaflet GIS, Lucide Icons, Web Speech API
- **Backend**: FastAPI, Uvicorn, NumPy, Pydantic (Python 3.10+)

---

## Getting Started

### Prerequisites
- Python 3.10 or higher
- Node.js 18 or higher with npm

---

### Execution Guide (Two Terminals)

To run the application, open two separate terminal windows:

#### Terminal 1: Backend (FastAPI)
```bash
# Navigate to backend directory
cd backend

# Install dependencies (if not already installed)
pip install fastapi uvicorn pydantic numpy

# Run the API server
python run.py
```
The backend server will start at `http://127.0.0.1:8000`. You can inspect the interactive API documentation at `http://127.0.0.1:8000/docs`.

---

#### Terminal 2: Frontend (React + Vite)
```bash
# Navigate to frontend directory
cd frontend

# Install node dependencies
npm install

# Start the development server
npm run dev
```
The frontend dashboard will be accessible at `http://localhost:5173`.

---

### Alternative: One-Click Startup (Windows)
On Windows, you can start both backend and frontend servers simultaneously by running:
```cmd
start_all.bat
```

---

## Preset Mission Scenarios

The system includes pre-calibrated mission presets with real-world satellite telemetry:

| Scenario / Region | Primary Sensor | Resolution | Key Analytical Focus |
| :--- | :--- | :--- | :--- |
| **Uttarakhand Cloudburst & Landslides** | Cartosat-3 (PAN + MX) | 0.28m GSD | Slope failure, mass wasting scarp, highway blockage |
| **Godavari Basin Flood Inundation** | RISAT-1A (C-band SAR) | 3.0m Stripmap | Cloud penetration, flooded crop fields, isolated villages |
| **Punjab Stubble Fire Hotspots** | INSAT-3DR TIR + Resourcesat-2A | 5.8m / 1km TIR | Thermal brightness anomaly (+14.2 K), burn scar mapping |
| **Gulf of Kutch Maritime Surveillance** | Cartosat-3 + RISAT-1A | 0.28m / 1.0m SAR | Fast patrol craft tracking, wake physics, radar cross section |
| **Bengaluru Wetland Encroachment** | Resourcesat-2A Multi-Temporal | 5.8m LISS-IV | 6-year urban built-up expansion, water body shrinkage |

---

## API Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check endpoint |
| `GET` | `/api/scenarios` | List all available satellite mission scenarios |
| `GET` | `/api/scenarios/{id}` | Get telemetry and metadata for a specific scenario |
| `POST` | `/api/query` | Process natural language spatial grounding query |
| `GET` | `/api/band-math` | List all supported spectral indices and formulas |
| `GET` | `/api/temporal/{id}` | Retrieve pre/post change detection statistics |
| `GET` | `/api/sar-fusion/{sensor}` | Retrieve SAR polarization profile and backscatter data |
| `POST` | `/api/dossier` | Generate formatted situation intelligence dossier |
| `GET` | `/api/export-geojson/{id}` | Export scenario vector features as GeoJSON |

---

## License

This project is licensed under the MIT License.
