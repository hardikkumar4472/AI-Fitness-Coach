# 💪 AI Fitness Coach App

An AI-powered fitness assistant built using React.js that generates personalized workout and diet plans using Google's Gemini LLM. The app includes voice features, image generation capabilities, and a beautiful modern UI.

## 🚀 Features

### Core Features
- **Personalized Plan Generation**: AI-powered workout and diet plans based on user profile
- **User Input Form**: Comprehensive form collecting:
  - Name, Age, Gender
  - Height & Weight
  - Fitness Goal (Weight Loss, Muscle Gain, etc.)
  - Current Fitness Level (Beginner / Intermediate / Advanced)
  - Workout Location (Home / Gym / Outdoor)
  - Dietary Preferences (Veg / Non-Veg / Vegan / Keto)
  - Optional: Medical history, stress level

### AI-Powered Features
- **🏋️ Workout Plan**: Daily exercise routines with sets, reps, and rest time
- **🥗 Diet Plan**: Meal breakdown for breakfast, lunch, dinner, and snacks
- **💬 AI Tips & Motivation**: Lifestyle and posture tips, motivational messages
- **📝 Dynamic Prompt Engineering**: All content is AI-generated and personalized

### Additional Features
- **🔊 Voice Features**: Text-to-speech using ElevenLabs API
  - Read workout plans aloud
  - Read diet plans aloud
  - Choose which section to listen to
- **🖼️ Image Generation**: Generate visual representations of exercises and meals
- **📄 PDF Export**: Export generated plans as PDF
- **🌗 Dark/Light Mode**: Toggle between themes
- **💾 Local Storage**: Save plans locally (MongoDB Atlas support included)
- **🔄 Regenerate Plan**: Generate new plans with same user data
- **✨ Smooth Animations**: Framer Motion animations throughout
- **💬 Daily Motivation Quotes**: AI-generated daily inspiration

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Axios** - HTTP client
- **jsPDF** - PDF generation
- **React Hot Toast** - Notifications
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database (with Mongoose)
- **Google Gemini AI** - LLM for plan generation
- **ElevenLabs** - Text-to-speech
- **CORS** - Cross-origin support

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- API Keys:
  - Google Gemini API key
  - ElevenLabs API key (optional, for voice features)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Add your API keys to `.env`:
```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
MONGODB_URI=mongodb://localhost:27017/fitness-coach
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fitness-coach
```

5. Start the server:
```bash
npm run dev
# or
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (optional, defaults to localhost):
```bash
# .env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 🔑 Getting API Keys

### Google Gemini API
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your backend `.env` file

### ElevenLabs API (Optional)
1. Visit [ElevenLabs](https://elevenlabs.io/)
2. Sign up and get your API key
3. Add it to your backend `.env` file

### MongoDB Atlas (Optional)
1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string
4. Add it to your backend `.env` file

## 📁 Project Structure

```
AI fitness coach app/
├── backend/
│   ├── routes/
│   │   ├── ai.js          # Gemini AI integration
│   │   ├── voice.js       # ElevenLabs TTS
│   │   └── plans.js       # MongoDB operations
│   ├── server.js          # Express server
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── UserForm.jsx
│   │   │   ├── PlanDisplay.jsx
│   │   │   └── MotivationQuote.jsx
│   │   ├── services/
│   │   │   └── api.js     # API calls
│   │   ├── utils/
│   │   │   └── pdfExport.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🚀 Deployment

### Backend (Vercel)
1. Install Vercel CLI: `npm i -g vercel`
2. Navigate to backend directory
3. Run `vercel`
4. Add environment variables in Vercel dashboard

### Frontend (Render)
1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set build command: `npm install && npm run build`
4. Set start command: `npm run preview`
5. Add environment variables

## 🎨 Features in Detail

### Plan Generation
The AI generates comprehensive 7-day plans including:
- Detailed workout routines with progressive difficulty
- Complete meal plans with nutritional information
- Lifestyle tips and motivation
- Personalized based on user's fitness level and goals

### Voice Features
- Click "Read Plan" to hear workout or diet plans
- Uses ElevenLabs high-quality text-to-speech
- Audio files are cached for performance

### Image Generation
- Click the image icon on any exercise or meal
- Generates visual representations
- Note: Currently returns enhanced prompts. Integrate Replicate API for actual image generation.

### PDF Export
- Export complete fitness plan as PDF
- Includes user info, workout plan, diet plan, and tips
- Professional formatting

### Dark Mode
- Toggle between light and dark themes
- Preference saved in local storage
- Smooth transitions

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Google Gemini for AI capabilities
- ElevenLabs for voice synthesis
- React and Vite communities
- All open-source contributors

---

**Note**: This is an internship project. For production use, consider:
- Adding authentication
- Implementing rate limiting
- Adding error monitoring
- Setting up proper logging
- Adding unit tests
- Implementing image generation with Replicate API
- Adding more voice options

