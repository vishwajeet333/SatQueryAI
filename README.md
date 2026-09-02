# SatQuery AI
### Multimodal Vision-Language Field Officer Copilot for Disaster Rescue Operations
**Smart India Hackathon (SIH) | Problem Statement ID: 26167**

SatQuery AI is an intelligent multimodal disaster response copilot engineered for NDRF, SDRF, and district emergency operations centers. It allows commanding officers to query real satellite observations in plain language (English, Hindi, or Malayalam) to isolate danger zones with real U-Net neural segmentation, pinpoint collapsed bridges and road cutoffs via OpenStreetMap topology, and generate printable Incident Action Plans (Rescue Reports) in under 10 seconds.

---

## Core Capabilities

- **Natural Language Officer Dispatch**: Primary entry point is a single search and voice command interface (Web Speech API) supporting English, Hindi (हिन्दी), and Malayalam (മലയാളം).
- **Real Neural Hazard Segmentation (U-Net)**: Executes convolutional tensor inference across multi-spectral Sentinel-2 optical and Sentinel-1 SAR imagery to segment debris flows, mudslides, and flood inundations with verified polygon contours and millisecond latency timers.
- **OpenStreetMap Infrastructure Topology**: Queries real-world road networks, collapsed bridges, operational triage hospitals, and safe helicopter staging bases.
- **Sub-10-Second Incident Action Plans (Rescue Reports)**: Automatically synthesizes printable, operational disaster briefings with severity rankings (Critical/High/Safe), casualty triage capacities, and NDRF tactical directives.
- **Optical-SAR Cloud Penetration**: Uses dual-polarization Synthetic Aperture Radar (SAR) backscatter to penetrate monsoon cloud cover and smoke plumes during active flood events.
- **Edge / Offline AI Mode**: Runs lightweight on-device segmentation and spatial reasoning for low-connectivity disaster field environments.

---

## Architecture & System Flow

```
                     [ Field Officer Query ]
                     (Plain Text / Voice Input)
                                │
                                ▼
                   [ Query Orchestrator Router ]
                                │
        ┌───────────────────────┼───────────────────────┐
        ▼                       ▼                       ▼
[ U-Net Hazard Seg ]    [ SAR Cloud Penetration ] [ OSM Field Topology ]
(Sentinel-1/2 Tensors)  (C-band Dual-Pol Radar)   (Bridges, Helipads, CHCs)
        │                       │                       │
        └───────────────────────┼───────────────────────┘
                                ▼
                    [ Tactical Action Composer ]
                                │
        ┌───────────────────────┴───────────────────────┐
        ▼                                               ▼
[ Live Map Danger Overlay ]              [ Sub-10s Incident Action Plan ]
(Glowing Contours & Routes)              (Printable NDRF Rescue Report)
```

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Leaflet GIS, Lucide Icons, Web Speech API
- **Backend**: FastAPI, Uvicorn, NumPy, Pydantic (Python 3.10+)

---

## Real-World Disaster Missions Included

| Disaster Mission / Location | Primary Satellite Sensors | Resolution | Tactical Operational Focus |
| :--- | :--- | :--- | :--- |
| **2024 Wayanad Landslide & Torrent** (Chooralmala, Mundakkai, Meppadi, Kerala) | Sentinel-2 (10m) + Sentinel-1 SAR | 10m MSI / 0.5m Aerial | Mundakkai debris fan ($2.14\text{ km}^2$), severed Chooralmala bridge, Meppadi CHC triage |
| **2023 Sikkim Glacial Lake Flood (GLOF)** (Chungthang & Teesta Valley, Sikkim) | Sentinel-1 C-Band SAR + Sentinel-2 | 10m SAR Stripmap | Teesta-III Dam breach surge ($3.85\text{ km}^2$), submerged NH-10A, Mangan forward helipad |

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
The backend server will start at `http://127.0.0.1:8000`. Interactive API documentation is available at `http://127.0.0.1:8000/docs`.

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
The officer dashboard will be accessible at `http://localhost:5173`.

---

## API Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check and neural engine status |
| `GET` | `/api/scenarios` | List active disaster response missions |
| `POST` | `/api/officer/query` | Main query orchestrator for hazard segmentation and map overlays |
| `POST` | `/api/officer/rescue-report` | Generate formatted NDRF Incident Action Plan in seconds |
| `GET` | `/api/officer/infrastructure/{id}` | Retrieve OpenStreetMap bridges, roads, and hospitals |
| `POST` | `/api/officer/segmentation` | Execute direct U-Net tensor segmentation on coordinates |
| `GET` | `/api/temporal/{id}` | Retrieve pre/post disaster change detection metrics |
| `GET` | `/api/export-geojson/{id}` | Export disaster vector features as GeoJSON |

---

## License

This project is licensed under the MIT License.
