# Quick Setup Guide

## 🚀 Getting Started

### Step 1: Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### Step 2: Configure Environment Variables

**Backend (.env file in backend/ directory):**
```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here  # Optional
MONGODB_URI=mongodb://localhost:27017/fitness-coach
```

**Frontend (.env file in frontend/ directory - Optional):**
```env
VITE_API_URL=http://localhost:5000/api
```

### Step 3: Get API Keys

1. **Google Gemini API:**
   - Visit: https://makersuite.google.com/app/apikey
   - Create a new API key
   - Copy and paste into backend/.env

2. **ElevenLabs API (Optional for voice features):**
   - Visit: https://elevenlabs.io/
   - Sign up and get your API key
   - Copy and paste into backend/.env

3. **MongoDB (Optional - uses local storage by default):**
   - Local: Install MongoDB locally
   - Atlas: Create free cluster at https://www.mongodb.com/cloud/atlas
   - Get connection string and add to backend/.env

### Step 4: Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Step 5: Open the App

Open your browser and navigate to:
```
http://localhost:5173
```

## 📝 Notes

- **Voice Features**: Will only work if ElevenLabs API key is configured
- **Image Generation**: Currently returns enhanced prompts. To enable actual image generation, integrate Replicate API (see backend/routes/ai.js)
- **MongoDB**: Optional - app works with local storage by default
- **Dark Mode**: Toggle available in the header

## 🐛 Troubleshooting

### Backend won't start
- Check if port 5000 is available
- Verify all dependencies are installed: `npm install`
- Check .env file exists and has correct format

### Frontend won't connect to backend
- Ensure backend is running on port 5000
- Check VITE_API_URL in frontend/.env matches backend URL
- Check CORS settings in backend/server.js

### API errors
- Verify API keys are correct in backend/.env
- Check API key permissions and quotas
- Review console logs for specific error messages

### MongoDB connection issues
- If using local MongoDB, ensure it's running
- If using Atlas, check connection string format
- App will work without MongoDB (uses local storage)

## 🎉 You're Ready!

Fill out the form and generate your personalized fitness plan!

