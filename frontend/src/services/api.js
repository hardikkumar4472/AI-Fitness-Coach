import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 120000, 
});

api.interceptors.request.use(
  (config) => {
    console.log("🚀 Making request to:", config.baseURL + config.url);
    return config;
  },
  (error) => {
    console.error("❌ Request config error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log("✅ Response received:", response.status, response.config.url);
    return response;
  },
  (error) => {
    const status = error.response?.status || "Network/Timeout";
    console.error(`❌ Response error [${status}]:`, error.message);
    return Promise.reject(error);
  }
);

export async function generatePlan(userData) {
  try {
    console.log("📤 Sending user data:", userData);
    const response = await api.post("/generate-plan", userData, {
      timeout: 120000, 
    });
    console.log("📥 Plan generated successfully");
    return response.data;
  } catch (error) {
    console.error("❌ Generate plan error:", error);

    if (error.code === "ECONNABORTED") {
      throw new Error("The request took too long. Please try again.");
    }

    const message =
      error.response?.data?.error ||
      error.message ||
      "Failed to generate plan. Please try again.";
    throw new Error(message);
  }
}

export async function generateImage(prompt) {
  const response = await api.post("/generate-image", { prompt });
  return response.data;
}

export async function textToSpeech(text, section) {
  try {
    const response = await api.post("/text-to-speech", { text, section });
    const audioData = response.data.audioUrl;

    if (typeof audioData === 'object' && audioData.fallback) {
      return audioData;
    }

    if (audioData.startsWith("/")) {
      return `${API_BASE_URL.replace("/api", "")}${audioData}`;
    }

    return audioData;
  } catch (error) {
    console.error("TTS Error:", error);

    return {
      fallback: true,
      text: text,
      message: "TTS service unavailable",
      section: section
    };
  }
}

export async function getMotivationQuote() {
  const response = await api.get("/motivation-quote");
  return response.data.quote;
}

export async function savePlan(planData) {
  const response = await api.post("/plans", planData);
  return response.data;
}

export async function getPlans() {
  const response = await api.get("/plans");
  return response.data;
}

export async function getPlanById(id) {
  const response = await api.get(`/plans/${id}`);
  return response.data;
}

export function speakWithBrowserTTS(text) {
  if ('speechSynthesis' in window) {

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    utterance.pitch = 1;
    utterance.volume = 0.8;

    const voices = speechSynthesis.getVoices();
    const englishVoice = voices.find(voice => 
      voice.lang.includes('en') && (voice.name.includes('Female') || voice.name.includes('Google') || voice.name.includes('Microsoft'))
    );
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    window.speechSynthesis.speak(utterance);
    return true;
  }
  return false;
}

export function savePlanToStorage(planData) {
  const plans = getPlansFromStorage();
  plans.unshift(planData);
  localStorage.setItem("fitnessPlans", JSON.stringify(plans.slice(0, 10)));
}

export function getPlansFromStorage() {
  const plans = localStorage.getItem("fitnessPlans");
  return plans ? JSON.parse(plans) : [];
}

export function getPlanFromStorage(id) {
  const plans = getPlansFromStorage();
  return plans.find((plan) => plan.id === id);
}