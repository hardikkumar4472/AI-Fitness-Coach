// // import fs from "fs";
// // import path from "path";
// // import { fileURLToPath } from "url";

// // const __filename = fileURLToPath(import.meta.url);
// // const __dirname = path.dirname(__filename);

// // /**
// //  * Generate speech using ElevenLabs API
// //  * @param {string} text - Text to convert to speech
// //  * @param {string} section - Context (e.g. "motivation", "summary")
// //  * @param {object} elevenlabs - Initialized ElevenLabs client
// //  * @returns {Promise<string>} - Public URL path to generated audio file
// //  */
// // export async function textToSpeech(text, section, elevenlabs) {
// //   try {
// //     console.log(`🎙️ Starting TTS generation for section: ${section}`);

// //     // 🗂️ Ensure /public/audio directory exists
// //     const audioDir = path.join(__dirname, "../public/audio");
// //     if (!fs.existsSync(audioDir)) {
// //       fs.mkdirSync(audioDir, { recursive: true });
// //       console.log("📁 Created audio directory:", audioDir);
// //     }

// //     // 🎧 Unique filename
// //     const timestamp = Date.now();
// //     const filename = `audio_${section || "tts"}_${timestamp}.mp3`;
// //     const filepath = path.join(audioDir, filename);

// //     // ⚙️ Validate ElevenLabs client
// //     if (!elevenlabs || !elevenlabs.generate) {
// //       throw new Error(
// //         "ElevenLabs API not configured. Please check ELEVENLABS_API_KEY in .env file."
// //       );
// //     }

// //     // 🗣️ Voices
// //     const primaryVoice = "Sarah"; // ✅ main voice
// //     const fallbackVoice = "Brian"; // ✅ backup if primary unavailable
// //     const model = "eleven_multilingual_v2"; // stable multilingual model

// //     let audioResponse;

// //     try {
// //       console.log(`🎤 Generating voice with: ${primaryVoice}`);
// //       audioResponse = await elevenlabs.generate({
// //         text,
// //         voice: primaryVoice,
// //         model_id: model,
// //       });
// //     } catch (voiceError) {
// //       if (voiceError.message?.includes("not a valid voice")) {
// //         console.warn(
// //           `⚠️ Voice "${primaryVoice}" invalid — retrying with fallback "${fallbackVoice}"`
// //         );
// //         audioResponse = await elevenlabs.generate({
// //           text,
// //           voice: fallbackVoice,
// //           model_id: model,
// //         });
// //       } else {
// //         throw voiceError;
// //       }
// //     }

// //     // 💾 Convert to buffer and save locally
// //     const buffer = Buffer.from(await audioResponse.arrayBuffer());
// //     fs.writeFileSync(filepath, buffer);
// //     console.log(`✅ Audio saved successfully: ${filename}`);

// //     // 🌐 Return public URL path (to serve via Express.static)
// //     return `/audio/${filename}`;
// //   } catch (error) {
// //     console.error("❌ Error in text-to-speech:", error);

// //     // More readable error for frontend
// //     throw new Error(
// //       `Failed to generate speech: ${error.message || "Unknown error"}`
// //     );
// //   }
// // }

// // /**
// //  * Optional: Utility to list available voices (for debugging)
// //  */
// // export async function listVoices(elevenlabs) {
// //   try {
// //     const voices = await elevenlabs.voices.list();
// //     console.log("✅ Available voices:");
// //     voices.voices.forEach((v) =>
// //       console.log(`- ${v.name} (${v.voice_id}) [${v.labels.language}]`)
// //     );
// //     return voices.voices;
// //   } catch (error) {
// //     console.error("❌ Error fetching voice list:", error);
// //     throw error;
// //   }
// // }
// import fs from "fs";
// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// /**
//  * Generate speech - tries ElevenLabs first, falls back to browser TTS instructions
//  */
// export async function textToSpeech(text, section, elevenlabs) {
//   try {
//     console.log(`🎙️ Starting TTS generation for section: ${section}`);

//     // 🗂️ Ensure /public/audio directory exists
//     const audioDir = path.join(__dirname, "../public/audio");
//     if (!fs.existsSync(audioDir)) {
//       fs.mkdirSync(audioDir, { recursive: true });
//       console.log("📁 Created audio directory:", audioDir);
//     }

//     // 🎧 Unique filename
//     const timestamp = Date.now();
//     const filename = `audio_${section || "tts"}_${timestamp}.mp3`;
//     const filepath = path.join(audioDir, filename);

//     // If ElevenLabs is available, try it first
//     if (elevenlabs && elevenlabs.textToSpeech) {
//       try {
//         console.log("🔹 Attempting ElevenLabs TTS...");
        
//         // Try with a known free-tier voice
//         const audio = await elevenlabs.textToSpeech.convert("21m00Tcm4TlvDq8ikWAM", {
//           text: text,
//           model_id: "eleven_monolingual_v1",
//           voice_settings: {
//             stability: 0.5,
//             similarity_boost: 0.5,
//           },
//         });
        
//         const buffer = Buffer.from(await audio.arrayBuffer());
//         fs.writeFileSync(filepath, buffer);
//         console.log(`✅ ElevenLabs audio saved: ${filename}`);
//         return `/audio/${filename}`;
        
//       } catch (elevenlabsError) {
//         console.warn("❌ ElevenLabs failed, using fallback:", elevenlabsError.message);
//       }
//     }

//     // 🎯 Fallback: Create a instruction file for browser TTS
//     return await generateBrowserTTSFallback(text, section, audioDir, filename);
    
//   } catch (error) {
//     console.error("❌ Error in text-to-speech:", error);
//     throw new Error(`TTS service unavailable. Please use browser text-to-speech.`);
//   }
// }

// /**
//  * Fallback for browser-based TTS
//  */
// async function generateBrowserTTSFallback(text, section, audioDir, filename) {
//   // Create a text file with instructions for browser TTS
//   const ttsInstructions = {
//     text: text,
//     section: section,
//     instructions: "Use browser's SpeechSynthesis API to read this text aloud",
//     timestamp: Date.now()
//   };
  
//   const instructionFile = filename.replace('.mp3', '.json');
//   const instructionPath = path.join(audioDir, instructionFile);
  
//   fs.writeFileSync(instructionPath, JSON.stringify(ttsInstructions, null, 2));
  
//   console.log("🔹 Using browser TTS fallback");
//   console.log("💡 Frontend should use: window.speechSynthesis.speak(new SpeechSynthesisUtterance(text))");
  
//   // Return the text so frontend can use browser TTS
//   return {
//     fallback: true,
//     text: text,
//     message: "Use browser text-to-speech",
//     instructionFile: `/audio/${instructionFile}`
//   };
// }

// /**
//  * Check if ElevenLabs is properly configured and working
//  */
// export async function checkTTSAvailability(elevenlabs) {
//   if (!elevenlabs) {
//     return {
//       available: false,
//       reason: "ElevenLabs not configured",
//       fallback: "browser-tts"
//     };
//   }

//   try {
//     // Simple test - try to get voices
//     await elevenlabs.voices.getAll();
    
//     // Try a minimal TTS request
//     await elevenlabs.textToSpeech.convert("21m00Tcm4TlvDq8ikWAM", {
//       text: "test",
//       model_id: "eleven_monolingual_v1",
//     });
    
//     return { available: true, provider: "elevenlabs" };
//   } catch (error) {
//     return {
//       available: false,
//       reason: error.message,
//       fallback: "browser-tts",
//       details: "Free tier may not include TTS access"
//     };
//   }
// }
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Generate speech - tries ElevenLabs first, falls back to browser TTS instructions
 */
export async function textToSpeech(text, section, elevenlabs) {
  try {
    console.log(`🎙️ Starting TTS generation for section: ${section}`);

    // 🗂️ Ensure /public/audio directory exists
    const audioDir = path.join(__dirname, "../public/audio");
    if (!fs.existsSync(audioDir)) {
      fs.mkdirSync(audioDir, { recursive: true });
      console.log("📁 Created audio directory:", audioDir);
    }

    // If ElevenLabs is available, try it first
    if (elevenlabs && elevenlabs.textToSpeech) {
      try {
        console.log("🔹 Attempting ElevenLabs TTS...");
        
        // Try with a known free-tier voice
        const audio = await elevenlabs.textToSpeech.convert("21m00Tcm4TlvDq8ikWAM", {
          text: text,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        });
        
        // 🎧 Unique filename
        const timestamp = Date.now();
        const filename = `audio_${section || "tts"}_${timestamp}.mp3`;
        const filepath = path.join(audioDir, filename);
        
        const buffer = Buffer.from(await audio.arrayBuffer());
        fs.writeFileSync(filepath, buffer);
        console.log(`✅ ElevenLabs audio saved: ${filename}`);
        return `/audio/${filename}`;
        
      } catch (elevenlabsError) {
        console.warn("❌ ElevenLabs failed, using browser TTS fallback:", elevenlabsError.message);
      }
    }

    // 🎯 Fallback: Return text for browser TTS
    console.log("🔹 Using browser TTS fallback");
    return {
      fallback: true,
      text: text,
      message: "Use browser text-to-speech",
      section: section
    };
    
  } catch (error) {
    console.error("❌ Error in text-to-speech:", error);
    // Return fallback even if there's an error
    return {
      fallback: true,
      text: text,
      message: "TTS service unavailable. Please use browser text-to-speech.",
      section: section
    };
  }
}

/**
 * Check if ElevenLabs is properly configured and working
 */
export async function checkTTSAvailability(elevenlabs) {
  if (!elevenlabs) {
    return {
      available: false,
      reason: "ElevenLabs not configured",
      fallback: "browser-tts"
    };
  }

  try {
    // Simple test - try to get voices
    await elevenlabs.voices.getAll();
    return { available: true, provider: "elevenlabs" };
  } catch (error) {
    return {
      available: false,
      reason: error.message,
      fallback: "browser-tts",
      details: "Free tier may not include TTS access"
    };
  }
}
