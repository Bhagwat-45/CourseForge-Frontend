# CourseForge Setup Guide

## Prerequisites

- Python 3.9+ 
- Node.js 18+
- npm or yarn

## Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
```

3. Activate the virtual environment:
- Windows: `venv\Scripts\activate`
- Linux/Mac: `source venv/bin/activate`

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Set up environment variables:
```bash
# Copy the example file
cp .env.example .env

# Edit .env and add your API keys
# GEMINI_API_KEY=your_key_here
```

6. Install Tesseract OCR (for image processing):
- Windows: Download from https://github.com/UB-Mannheim/tesseract/wiki
- Linux: `sudo apt-get install tesseract-ocr`
- Mac: `brew install tesseract`

7. Run the backend server:
```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

## Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Create .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1" > .env.local
```

4. Run the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Usage

1. Start both backend and frontend servers
2. Open `http://localhost:3000` in your browser
3. Upload a file, paste text, or provide a URL
4. Wait for AI to generate the course
5. Explore the generated course with lessons, quizzes, and flashcards
6. Chat with the AI tutor for help

## Features

- ✅ Upload PDFs, images, audio, video, text, or URLs
- ✅ Automatic course generation with AI
- ✅ Multi-level explanations (Beginner, Intermediate, Expert)
- ✅ Interactive quizzes
- ✅ Auto-generated flashcards
- ✅ AI tutor chat
- ✅ Progress tracking
- ✅ Export functionality (summaries, notes, flashcards)

## Troubleshooting

### Backend Issues

- **Import errors**: Make sure you're running from the backend directory
- **Database errors**: The SQLite database will be created automatically
- **OCR not working**: Install Tesseract and update TESSERACT_CMD in .env if needed
- **Gemini errors**: Check your GEMINI_API_KEY in .env. Get key from: https://makersuite.google.com/app/apikey

### Frontend Issues

- **API connection errors**: Ensure backend is running on port 8000
- **Build errors**: Run `npm install` again
- **CORS errors**: Check backend CORS settings in main.py

## Production Deployment

For production:
1. Use PostgreSQL instead of SQLite
2. Set up proper environment variables
3. Use a production WSGI server (e.g., Gunicorn)
4. Build the frontend: `npm run build`
5. Serve the frontend with a production server





