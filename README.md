# PaperForge / VedaAI Assessment Creator

A production-quality, AI-powered platform for generating highly tailored academic assessment papers.

## 🚀 Architecture Overview

This project is built using a **Turborepo** monorepo architecture with **pnpm workspaces**, ensuring strict boundary separation, blazing fast builds, and clean code sharing.

### Tech Stack
*   **Frontend (`apps/web`)**: Next.js 15 App Router, TypeScript, Tailwind CSS, Zustand, React Hook Form + Zod, Framer Motion.
*   **Backend (`apps/server`)**: Node.js, Express, TypeScript, Socket.io, BullMQ, Mongoose.
*   **Infrastructure**: Redis (Queue), MongoDB (Data), OpenAI GPT-4o-mini (Generation).
*   **Shared Packages**:
    *   `@paperforge/types`: Shared TS interfaces and Zod schemas.

## ⚙️ How It Works (Async Architecture & Websockets)

1.  **Job Creation**: The frontend sends an assessment generation request (`POST /generate`) to the backend.
2.  **Queueing**: The backend saves the assignment to MongoDB and pushes a job to **BullMQ** (backed by Redis), instantly returning a `jobId` to the frontend.
3.  **Realtime Tracking**: The frontend connects to **Socket.io** using the `jobId` and listens for `jobUpdate` events.
4.  **Worker Processing**: The BullMQ worker picks up the job, constructs a rigid prompt, and calls OpenAI. It emits progress updates via Socket.io during this process.
5.  **Completion**: Once the AI returns the structured JSON, the worker validates it, saves it to MongoDB, and emits a `COMPLETED` event.
6.  **Rendering**: The frontend redirects the user to the generated paper, rendering it in a beautiful, print-friendly format.

## 📦 Monorepo Structure

```text
PaperForge/
├── apps/
│   ├── web/         # Next.js Frontend
│   └── server/      # Express Backend & BullMQ Worker
├── packages/
│   └── types/       # Shared TypeScript definitions
├── docker-compose.yml
└── package.json
```

## 🛠 Setup & Installation

### Prerequisites
*   Node.js (v20+)
*   `pnpm` (v9+)
*   Docker & Docker Compose (for local Redis/MongoDB)

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Environment Variables
Create a `.env` file in `apps/server`:
```env
PORT=3001
MONGODB_URI=mongodb://admin:password@localhost:27017/paperforge?authSource=admin
REDIS_HOST=localhost
REDIS_PORT=6379
OPENAI_API_KEY=your_openai_api_key
```

### 3. Start Infrastructure
Start the local Redis and MongoDB instances:
```bash
docker-compose up -d
```

### 4. Run the Application
Start the entire monorepo in development mode using Turborepo:
```bash
pnpm run dev
```

*   **Frontend**: `http://localhost:3000`
*   **Backend**: `http://localhost:3001`

## 🌍 Deployment Instructions

### Frontend (Vercel)
1. Import the repository into Vercel.
2. Set the root directory to `apps/web`.
3. Vercel will automatically detect Next.js.
4. Set the `NEXT_PUBLIC_API_URL` environment variable to your backend URL.

### Backend (Railway / Render)
1. Import the repository.
2. Set the root directory to `apps/server` or specify the build command `pnpm --filter server build`.
3. Start command: `pnpm --filter server start`.
4. Provision a Redis instance (e.g., Upstash) and a MongoDB Atlas cluster.
5. Provide `REDIS_HOST`, `REDIS_PORT`, `MONGODB_URI`, and `OPENAI_API_KEY` in the environment variables.

## ✨ UX/UI Details
The frontend is meticulously designed using **Tailwind CSS** tokens, custom animations (`framer-motion`), and functional micro-interactions. The final paper rendering strips away unnecessary UI elements for a clean, institutional `print` layout.
