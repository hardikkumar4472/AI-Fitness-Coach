import { GoogleGenerativeAI } from '@google/generative-ai';
import { HfInference } from '@huggingface/inference';

// Initialize Hugging Face (free tier - no API key required for some models)
const hf = new HfInference();

/**
 * Generate a personalized fitness plan using Gemini 2.5
 */
export async function generatePlan(userData, genAI) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured in environment variables');
  }

  try {
    console.log('🤖 Generating plan with Gemini AI...');

    let model;
    try {
      // ✅ Use the latest stable Gemini 2.5 model
      model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });
    } catch (modelError) {
      console.warn('⚠️ gemini-2.5-pro not available, trying gemini-2.5-flash');
      model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    }

    const prompt = `
You are an expert fitness coach and nutritionist. Create a comprehensive, personalized fitness and diet plan based on the following user information:

**User Profile:**
- Name: ${userData.name}
- Age: ${userData.age}
- Gender: ${userData.gender}
- Height: ${userData.height} cm
- Weight: ${userData.weight} kg
- Fitness Goal: ${userData.fitnessGoal}
- Fitness Level: ${userData.fitnessLevel}
- Workout Location: ${userData.workoutLocation}
- Dietary Preferences: ${userData.dietaryPreferences}
${userData.medicalHistory ? `- Medical History: ${userData.medicalHistory}` : ''}
${userData.stressLevel ? `- Stress Level: ${userData.stressLevel}` : ''}

**Requirements:**
1. Create a detailed 7-day workout plan with specific exercises (sets, reps, rest)
2. Create a 7-day diet plan with meals (calories, macros, description)
3. Provide 3-5 actionable lifestyle tips and one motivational message

**Format your response strictly as a JSON object:**
{
  "workoutPlan": { "day1": { "exercises": [] }, ... },
  "dietPlan": { "day1": { "breakfast": {}, "lunch": {}, ... }, ... },
  "tips": ["Tip 1", "Tip 2", "Tip 3"],
  "motivation": "Motivational message here"
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    console.log('📄 Raw AI response received.');

    // Extract JSON safely
    let jsonText = text;
    const codeBlockMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
    if (codeBlockMatch) {
      jsonText = codeBlockMatch[1];
      console.log('✅ Extracted JSON from code block');
    } else {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonText = jsonMatch[0];
        console.log('✅ Extracted JSON from plain text');
      }
    }

    // Try parsing JSON
    try {
      const parsed = JSON.parse(jsonText);
      console.log('✅ Successfully parsed AI JSON plan');
      return parsed;
    } catch {
      console.warn('⚠️ Failed to parse JSON. Returning fallback plan.');
      return createFallbackPlan(userData);
    }
  } catch (error) {
    console.error('❌ Error generating plan:', error);

    if (error.message.includes('API_KEY') || error.message.includes('quota')) {
      throw new Error('AI service configuration error. Please check your API key.');
    }
    if (error.message.includes('404') || error.message.includes('not found')) {
      throw new Error('AI model not available. Please check the model name.');
    }
    if (error.message.includes('429')) {
      throw new Error('API rate limit exceeded. Please try again later.');
    }

    throw new Error(`Failed to generate fitness plan: ${error.message}`);
  }
}

/**
 * Fallback static plan if AI call fails
 */
function createFallbackPlan(userData) {
  console.log('🔄 Creating fallback plan...');
  const workoutPlan = {};
  const dietPlan = {};

  for (let i = 1; i <= 7; i++) {
    workoutPlan[`day${i}`] = {
      exercises: [
        {
          name: "Warm-up Cardio",
          sets: "1",
          reps: "10 minutes",
          rest: "2 min",
          description: "Light cardio to increase heart rate and warm up muscles"
        },
        {
          name: "Bodyweight Exercises",
          sets: "3",
          reps: "12-15",
          rest: "60s",
          description: "Full body workout using bodyweight"
        }
      ]
    };

    dietPlan[`day${i}`] = {
      breakfast: {
        meal: "Oatmeal with fruits and nuts",
        calories: "350-400",
        protein: "12g",
        carbs: "60g",
        fats: "8g"
      },
      lunch: {
        meal: "Balanced meal with protein and vegetables",
        calories: "450-500",
        protein: "25g",
        carbs: "50g",
        fats: "15g"
      },
      dinner: {
        meal: "Lean protein with complex carbs",
        calories: "400-450",
        protein: "30g",
        carbs: "40g",
        fats: "12g"
      },
      snack1: { meal: "Fruit or yogurt", calories: "150-200" },
      snack2: { meal: "Nuts or protein shake", calories: "150-200" }
    };
  }

  return {
    workoutPlan,
    dietPlan,
    tips: [
      "Stay hydrated by drinking at least 8 glasses of water daily",
      "Aim for 7-9 hours of quality sleep each night",
      "Listen to your body and take rest days when needed",
      "Maintain consistency in your workout routine",
      "Combine exercise with proper nutrition for best results"
    ],
    motivation: `Great job taking the first step, ${userData.name}! Your commitment to ${userData.fitnessGoal} is inspiring. Every step counts! 💪`
  };
}

/**
 * Generate actual images using Stable Diffusion
 */
export async function generateImage(prompt, genAI) {
  try {
    console.log('🎨 Generating actual image for:', prompt);

    // First, enhance the prompt using Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const enhancementPrompt = `
    Create a detailed, professional prompt for generating a high-quality image of: ${prompt}.
    The image should be realistic, well-lit, and professionally composed.
    Include specific details about:
    - Lighting (natural, studio, etc.)
    - Composition and angle
    - Style and mood
    - Background setting
    - Visual quality and details
    Make it suitable for Stable Diffusion.
    Return only the prompt text, nothing else.`;

    const enhancementResult = await model.generateContent(enhancementPrompt);
    const enhancedPrompt = enhancementResult.response.text().trim();

    console.log('🖼️ Enhanced prompt:', enhancedPrompt);

    // Generate actual image using Stable Diffusion
    try {
      // Using a free Stable Diffusion model from Hugging Face
      const imageBlob = await hf.textToImage({
        inputs: enhancedPrompt,
        model: "stabilityai/stable-diffusion-2-1",
        parameters: {
          num_inference_steps: 20,
          guidance_scale: 7.5,
          width: 512,
          height: 512
        }
      });

      // Convert blob to base64 for displaying in frontend
      const arrayBuffer = await imageBlob.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString('base64');
      const imageUrl = `data:image/jpeg;base64,${base64}`;

      console.log('✅ Image generated successfully');

      return {
        imageUrl: imageUrl,
        prompt: enhancedPrompt,
        originalPrompt: prompt,
        type: prompt.includes('exercise') ? 'exercise' : 'meal'
      };

    } catch (sdError) {
      console.warn('❌ Stable Diffusion failed, trying alternative approach:', sdError.message);
      
      // Fallback: Use a different free model
      return await generateImageFallback(enhancedPrompt, prompt);
    }

  } catch (error) {
    console.error('❌ Error generating image:', error);
    throw new Error('Failed to generate image. Please try again.');
  }
}

/**
 * Fallback image generation using alternative free service
 */
async function generateImageFallback(enhancedPrompt, originalPrompt) {
  try {
    // Alternative: Use a simpler model or return a placeholder
    console.log('🔄 Using fallback image generation');
    
    // For now, return a placeholder with the prompt
    // In a real implementation, you could use:
    // - OpenAI DALL-E (paid)
    // - Replicate API (paid)
    // - Local Stable Diffusion
    // - Other free tier services
    
    return {
      imageUrl: null, // No image URL for fallback
      prompt: enhancedPrompt,
      originalPrompt: originalPrompt,
      type: originalPrompt.includes('exercise') ? 'exercise' : 'meal',
      note: 'Image generation service is currently unavailable. The AI prompt has been prepared for manual image generation.'
    };
  } catch (error) {
    console.error('❌ Fallback image generation failed:', error);
    throw new Error('Image generation service is temporarily unavailable.');
  }
}

/**
 * Generate a short motivational quote
 */
export async function generateMotivationQuote(genAI) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = `Generate a short, unique fitness motivation quote (1–2 sentences). Plain text only.`;
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error('❌ Error generating quote:', error);
    return "Every step forward is progress. Keep going! 💪";
  }
}