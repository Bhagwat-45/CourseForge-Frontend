# CourseForge

**Upload anything → AI analyzes → Generates full course → Display everything in one clean page**

## 🎯 Overview

CourseForge is an AI-powered full-stack web application that transforms any uploaded content (PDFs, images, topics, or URLs) into a complete, interactive course.

## 🏗️ Architecture

- **Frontend**: React (Vite) + Tailwind CSS + Framer Motion
- **Backend**: FastAPI (Python) + SQLite/PostgreSQL
- **AI**: Google Gemini API
- **Features**: 3D Animated UI, AI Tutor (Nova), Interactive Quizzes, and Progress Tracking.

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 18+
- Python 3.10+
- Google Gemini API Key

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
# Create .env and add your GEMINI_API_KEY
uvicorn main:app --reload
```

### 3. Frontend Setup
```bash
npm install
npm run dev
```

## ✨ Features

- 🎨 **Animated 3D Homepage** - Modern dark theme with blue accents and tilt effects.
- 📤 **Drag & Drop Upload** - Supports PDF, images, docs, and direct topic input.
- 🤖 **AI Course Generation** - Structured learning paths created by Google Gemini.
- 📚 **Learning Tools** - Integrated AI Tutor, quizzes, and achievement tracking.

## 📝 License

MIT
#   C o u r s e F o r g e 0 1  