import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { generatePlan, generateImage, generateMotivationQuote } from './routes/ai.js';
import { savePlan, getPlans, getPlanById } from './routes/plans.js';
import { textToSpeech } from './routes/voice.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/audio', express.static(path.join(__dirname, 'public/audio')));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

let elevenlabs = null;
async function initElevenLabs() {
  if (elevenlabs) return elevenlabs;

  if (process.env.ELEVENLABS_API_KEY) {
    try {
      const { ElevenLabsClient } = await import('elevenlabs');
      elevenlabs = new ElevenLabsClient({
        apiKey: process.env.ELEVENLABS_API_KEY
      });
      console.log('✅ ElevenLabs initialized');
      return elevenlabs;
    } catch (error) {
      console.warn('⚠️ ElevenLabs not available:', error.message);
      return null;
    }
  } else {
    console.warn('⚠️ ElevenLabs API key not found. Voice features will be disabled.');
    return null;
  }
}

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fitness-coach', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

app.post('/api/generate-plan', async (req, res) => {
  try {
    const plan = await generatePlan(req.body, genAI);
    res.json(plan);
  } catch (error) {
    console.error('Error generating plan:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/generate-image', async (req, res) => {
  try {
    const { prompt } = req.body;
    const imageUrl = await generateImage(prompt, genAI);
    res.json({ imageUrl });
  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/text-to-speech', async (req, res) => {
  try {
    const { text, section } = req.body;
    const client = await initElevenLabs();
    if (!client) {
      return res.status(503).json({ error: 'ElevenLabs API not configured. Please add ELEVENLABS_API_KEY to your .env file.' });
    }
    const audioUrl = await textToSpeech(text, section, client);
    res.json({ audioUrl });
  } catch (error) {
    console.error('Error generating speech:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/motivation-quote', async (req, res) => {
  try {
    const quote = await generateMotivationQuote(genAI);
    res.json({ quote });
  } catch (error) {
    console.error('Error generating quote:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/plans', async (req, res) => {
  try {
    const plan = await savePlan(req.body);
    res.json(plan);
  } catch (error) {
    console.error('Error saving plan:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/plans', async (req, res) => {
  try {
    const plans = await getPlans();
    res.json(plans);
  } catch (error) {
    console.error('Error fetching plans:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/plans/:id', async (req, res) => {
  try {
    const plan = await getPlanById(req.params.id);
    res.json(plan);
  } catch (error) {
    console.error('Error fetching plan:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'AI Fitness Coach Backend is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log("🔑 ELEVENLABS_API_KEY loaded?", !!process.env.ELEVENLABS_API_KEY);
});