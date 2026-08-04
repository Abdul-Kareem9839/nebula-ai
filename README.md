# Nebula

Nebula is an AI-powered interview preparation platform that helps users practice interviews, upload resumes, receive adaptive coaching, and track their growth over time through a futuristic, immersive experience.

## What Nebula does

Nebula combines a modern React frontend with an Express backend to create a complete interview-training workflow:

- User authentication with JWT-based login and registration
- Resume upload and analysis workflow
- AI-led interview sessions with configurable personas and difficulty
- Adaptive question generation based on the user's responses and skill level
- Feedback summaries and skill tracking after each interview
- Visual skill progression through a galaxy-style experience
- Memory crystal-style interview history for reflection and review
- Voice-enabled interview experience using the browser's speech APIs

## Core features

### 1. Smart interview experience

- Start interviews manually or from a resume upload
- Choose role, skill level, interview type, and mentor personality
- Adjust session depth with question limit presets
- Receive AI-generated feedback and skill insights after the session

### 2. Resume-aware coaching

- Upload a PDF or DOCX resume
- Send the resume to the backend for analysis
- Use resume insights to tailor interview questions and recommendations

### 3. Skill growth tracking

- Store and update learned skills over time
- Visualize progress in a constellation-like skill galaxy
- Track confidence, level, and improvement across sessions

### 4. Memory and reflection

- Save each interview session as a memorable artifact
- Review interview summaries and performance history
- Build a long-term record of growth and preparation

### 5. Immersive UI

- Cosmic, space-themed landing experience
- Animated interview chamber and feedback panels
- Responsive layout built with Tailwind CSS and Framer Motion

## Tech stack

### Frontend

- React 18
- Vite
- React Router
- Tailwind CSS
- Framer Motion
- Axios
- Lucide icons

### Backend

- Node.js + Express
- MongoDB with Mongoose
- JWT authentication
- Multer + Cloudinary for resume uploads
- AI provider abstraction for Gemini, Groq, and OpenRouter

## Project structure

```text
backend/
  src/
    app.js
    server.js
    config/
    features/
    middleware/
    services/
    utils/

frontend/
  src/
    App.jsx
    features/
    shared/
```

## Getting started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd nebula
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend folder with the following variables:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
AI_PROVIDER=gemini

GEMINI_API_KEY=your_gemini_key
GEMINI_MODEL=gemini-2.0-flash

GROQ_API_KEY=your_groq_key
GROQ_MODEL=llama-3.3-70b-versatile

OPENROUTER_API_KEY=your_openrouter_key
OPENROUTER_MODEL=meta-llama/llama-3.1-8b-instruct:free

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Then start the backend:

```bash
npm run dev
```

### 3. Frontend setup

```bash
cd ../frontend
npm install
```

Create a `.env` file in the frontend folder:

```env
VITE_API_URL=http://localhost:5000/api
```

Then start the frontend:

```bash
npm run dev
```

The app should now be available at:

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## API overview

The backend exposes REST endpoints under `/api` for:

- Authentication: `/api/auth`
- Interviews: `/api/interviews`
- Resume uploads: `/api/resume`
- Skill tracking: `/api/skills`
- Health check: `/api/health`

## Current status

Nebula is already structured as a working full-stack application with real authentication, interview flows, AI-backed interview orchestration, resume handling, and interactive visual features. Some areas may continue to evolve as the product matures, but the core experience is in place.

## Roadmap ideas

- Expand resume parsing quality and structured analysis
- Add richer interview analytics and streaks
- Introduce daily practice recommendations
- Improve voice interaction fidelity
- Add coding interview sandbox support

## License

This project is for personal or educational use unless a separate license is provided.
