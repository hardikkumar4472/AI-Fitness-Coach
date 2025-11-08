import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { Sun, Moon, Volume2, Download, RefreshCw, Sparkles, X, Loader2 } from 'lucide-react';
import UserForm from './components/UserForm';
import PlanDisplay from './components/PlanDisplay';
import MotivationQuote from './components/MotivationQuote';
import { generatePlan, generateImage, textToSpeech, getMotivationQuote, savePlanToStorage, getPlansFromStorage, speakWithBrowserTTS } from './services/api';
import { exportToPDF } from './utils/pdfExport';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [userData, setUserData] = useState(null);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [motivationQuote, setMotivationQuote] = useState('');
  const [savedPlans, setSavedPlans] = useState([]);
  const [imageModal, setImageModal] = useState({ isOpen: false, data: null, loading: false });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    // Load saved plans from local storage
    const plans = getPlansFromStorage();
    setSavedPlans(plans);
    
    // Load daily motivation quote
    loadMotivationQuote();
  }, []);

  const loadMotivationQuote = async () => {
    try {
      const quote = await getMotivationQuote();
      setMotivationQuote(quote);
    } catch (error) {
      setMotivationQuote("Every step forward is progress. Keep going! 💪");
    }
  };

  const handleFormSubmit = async (data) => {
    setLoading(true);
    try {
      const generatedPlan = await generatePlan(data);
      setPlan(generatedPlan);
      setUserData(data);
      
      // Save to local storage
      const planData = {
        id: Date.now().toString(),
        userData: data,
        plan: generatedPlan,
        createdAt: new Date().toISOString()
      };
      savePlanToStorage(planData);
      setSavedPlans([planData, ...savedPlans]);
      
      toast.success('Fitness plan generated successfully! 🎉');
    } catch (error) {
      toast.error('Failed to generate plan. Please try again.');
      console.error('Error generating plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (!userData) return;
    await handleFormSubmit(userData);
  };

  const handleExportPDF = () => {
    if (!plan || !userData) {
      toast.error('No plan to export');
      return;
    }
    exportToPDF(userData, plan);
    toast.success('Plan exported to PDF! 📄');
  };

  const handleImageClick = async (item, type) => {
    try {
      const prompt = type === 'exercise' 
        ? `Professional fitness exercise: ${item.name}, ${item.description || ''}`
        : `Delicious healthy meal: ${item.meal}, ${item.description || ''}`;
      
      // Show loading modal immediately
      setImageModal({
        isOpen: true,
        data: { item, type, loading: true },
        loading: true
      });
      
      const imageData = await generateImage(prompt);
      
      setImageModal({
        isOpen: true,
        data: {
          ...imageData,
          item,
          type,
          loading: false
        },
        loading: false
      });
      
      toast.success('Image generated successfully! 🎨');
    } catch (error) {
      setImageModal({ isOpen: false, data: null, loading: false });
      toast.error('Failed to generate image. Please try again.');
      console.error('Error generating image:', error);
    }
  };

  const handleTextToSpeech = async (text, section) => {
    try {
      toast.loading('Generating audio...', { id: 'tts' });
      
      const audioResult = await textToSpeech(text, section);
      
      // Check if it's a fallback to browser TTS
      if (audioResult.fallback) {
        toast.dismiss('tts');
        const success = speakWithBrowserTTS(text);
        if (success) {
          toast.success(`Reading ${section} with browser voice... 🔊`, { id: 'tts' });
        } else {
          toast.error('Browser text-to-speech not supported', { id: 'tts' });
        }
      } else {
        // Play the audio file from ElevenLabs
        const audio = new Audio(audioResult);
        audio.onended = () => toast.dismiss('tts');
        audio.onerror = () => {
          toast.error('Failed to play audio', { id: 'tts' });
        };
        await audio.play();
        toast.success(`Playing ${section}... 🔊`, { id: 'tts' });
      }
    } catch (error) {
      toast.dismiss('tts');
      // Try browser TTS as final fallback
      const success = speakWithBrowserTTS(text);
      if (success) {
        toast.success(`Reading ${section} with browser voice... 🔊`);
      } else {
        toast.error('Text-to-speech not available');
      }
      console.error('TTS Error:', error);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
    }`}>
      <Toaster 
        position="top-right"
        toastOptions={{
          className: darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900',
        }}
      />
      
      {/* Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-700"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              AI Fitness Coach
            </h1>
          </motion.div>
          
          <div className="flex items-center gap-4">
            {plan && (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRegenerate}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Regenerate
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleExportPDF}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export PDF
                </motion.button>
              </>
            )}
            <motion.button
              whileHover={{ rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700" />
              )}
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {!plan ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <MotivationQuote quote={motivationQuote} />
              <UserForm onSubmit={handleFormSubmit} loading={loading} />
            </motion.div>
          ) : (
            <motion.div
              key="plan"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <PlanDisplay
                userData={userData}
                plan={plan}
                onImageClick={handleImageClick}
                onTextToSpeech={handleTextToSpeech}
                darkMode={darkMode}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Image Modal */}
      <AnimatePresence>
        {imageModal.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setImageModal({ isOpen: false, data: null, loading: false })}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {imageModal.data?.type === 'exercise' ? 'Exercise Visualization' : 'Meal Visualization'}
                </h3>
                <button
                  onClick={() => setImageModal({ isOpen: false, data: null, loading: false })}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {imageModal.loading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                      Generating your image...
                    </p>
                    <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
                      This may take a few seconds
                    </p>
                  </div>
                ) : imageModal.data?.imageUrl ? (
                  <div className="space-y-6">
                    <div className="text-center">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {imageModal.data?.type === 'exercise' 
                          ? imageModal.data?.item?.name
                          : imageModal.data?.item?.meal
                        }
                      </h4>
                      {imageModal.data?.item?.description && (
                        <p className="text-gray-600 dark:text-gray-400">
                          {imageModal.data?.item?.description}
                        </p>
                      )}
                    </div>

                    <div className="flex justify-center">
                      <motion.img
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        src={imageModal.data.imageUrl}
                        alt={imageModal.data.originalPrompt}
                        className="max-w-full h-auto max-h-96 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600"
                      />
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                      <h5 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                        AI-Generated Prompt
                      </h5>
                      <p className="text-gray-700 dark:text-gray-300 text-sm">
                        {imageModal.data.prompt}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6 border border-yellow-200 dark:border-yellow-800">
                      <p className="text-yellow-800 dark:text-yellow-200 mb-4">
                        Image generation is currently unavailable. Please try again later.
                      </p>
                      <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                        We're working on restoring this feature. In the meantime, you can use the prompt above with other AI image generators.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setImageModal({ isOpen: false, data: null, loading: false })}
                  className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;