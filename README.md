# 🏟️ PlayScope — Football Video Analytics System

AI-powered football match analysis platform. Upload match footage, detect players with YOLOv8, track movement with DeepSORT, and visualize comprehensive analytics through a premium dashboard.

![License](https://img.shields.io/badge/license-MIT-blue)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-green)
![YOLOv8](https://img.shields.io/badge/YOLOv8-8.3-purple)

---

## ✨ Features

- **🔍 Player Detection** — YOLOv8 detects every player, referee, and ball
- **📡 Multi-Object Tracking** — DeepSORT maintains player IDs across frames
- **🔥 Heatmaps** — Beautiful pitch overlay showing player movement density
- **⏱️ Event Timeline** — Interactive timeline of passes, shots, goals, and fouls
- **📊 Match Statistics** — Possession, shots, passes, and more
- **🎥 Tactical View** — 2D pitch visualization with animated tracking
- **📈 Charts** — Possession donut, passes over time
- **🎯 Upload & Process** — Drag-and-drop video upload with progress tracking

---

## 🏗️ Architecture

```
PlayScope/
├── frontend/          # Next.js 15 App Router (TypeScript + Tailwind)
├── backend/           # FastAPI (Python 3.11, SQLAlchemy, JWT)
├── ai-engine/         # YOLOv8 + DeepSORT (Python, OpenCV, PyTorch)
├── infra/             # Nginx, deployment configs
├── docker-compose.yml # Full stack orchestration
├── .env.example       # Environment variables template
└── .github/workflows/ # CI/CD pipeline
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Python 3.11+
- Docker & Docker Compose (optional, for full stack)
- PostgreSQL (or use Docker)

### Frontend Only (Demo Mode)

```bash
cd frontend
npm install
npm run dev
```

Navigate to `http://localhost:3000` — the dashboard works immediately with built-in demo data.

### Full Stack (Docker)

```bash
# Copy environment variables
cp .env.example .env

# Start all services
docker-compose up -d

# Frontend
cd frontend && npm install && npm run dev
```

### Backend Only

```bash
cd backend
pip install -r requirements.txt

# Start PostgreSQL (via Docker or locally)
docker run -d --name playscope-db \
  -e POSTGRES_DB=playscope \
  -e POSTGRES_USER=playscope \
  -e POSTGRES_PASSWORD=playscope \
  -p 5432:5432 postgres:16-alpine

# Run the API
uvicorn app.main:app --reload --port 8000
```

API docs at `http://localhost:8000/docs`

### AI Engine

```bash
cd ai-engine
pip install -r requirements.txt

# Process a video
python engine/pipeline.py path/to/match.mp4
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/auth/register` | Register new user |
| `POST` | `/api/v1/auth/login` | Login, get JWT token |
| `POST` | `/api/v1/videos/upload` | Upload match video |
| `GET` | `/api/v1/videos/jobs/{id}/status` | Check processing status |
| `GET` | `/api/v1/videos/jobs/{id}/results` | Get analysis results |
| `GET` | `/api/v1/videos/matches` | List all matches |

---

## 🧠 AI Pipeline

```
Video → YOLOv8 Detection → DeepSORT Tracking → Event Extraction → Stats Generation → JSON Output
```

1. **Detection**: YOLOv8 nano model detects persons (players) and sports ball
2. **Tracking**: DeepSORT assigns persistent IDs using Kalman filtering + appearance features
3. **Events**: Pass detection (ball proximity changes), shot detection (ball trajectory)
4. **Stats**: Possession, heatmap data, team statistics computed from tracking

---

## 🎨 Tech Stack

| Component | Technology |
|-----------|-----------|
| **Frontend** | Next.js 15, TypeScript, Tailwind CSS, Recharts |
| **Backend** | FastAPI, SQLAlchemy (async), PostgreSQL, JWT |
| **AI Engine** | YOLOv8, DeepSORT, OpenCV, PyTorch |
| **Infrastructure** | Docker, Nginx, GitHub Actions |
| **Deployment** | Vercel (frontend), Docker/Railway (backend), GPU EC2 (AI) |

---

## ☁️ Deployment

### Frontend → Vercel
```bash
cd frontend
npx vercel --prod
```

### Backend → Docker/Railway
```bash
docker build -t playscope-backend ./backend
docker run -p 8000:8000 playscope-backend
```

### AI Engine → GPU Instance
```bash
docker build -t playscope-ai ./ai-engine
# Deploy to GPU-enabled instance (AWS EC2 g4dn, etc.)
```

---

## 📄 License

MIT License — free to use, modify, and distribute.
