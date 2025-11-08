import dotenv from 'dotenv';
dotenv.config();

import { ElevenLabsClient } from "elevenlabs";
import fs from 'fs';

const client = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

async function testWithDifferentVoices() {
  try {
    console.log('🎤 Testing with different voices...');

    const testText = "Hello! This is a test.";

    const voiceTests = [
      { name: "Rachel", id: "21m00Tcm4TlvDq8ikWAM" }, 
      { name: "Clyde", id: "2EiwWnXFnvU5JabPnv8n" }, 
      { name: "Sarah", id: "EXAVITQu4vr4xnSDxMaL" }, 
    ];

    for (const voice of voiceTests) {
      try {
        console.log(`\n🔹 Testing voice: ${voice.name} (${voice.id})`);

        const audio = await client.textToSpeech.convert(voice.id, {
          text: testText,
          model_id: "eleven_monolingual_v1", 
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        });

        const buffer = Buffer.from(await audio.arrayBuffer());
        fs.writeFileSync(`test-${voice.name}.mp3`, buffer);
        console.log(`✅ SUCCESS with ${voice.name}!`);
        break; 

      } catch (error) {
        console.log(`❌ Failed with ${voice.name}: ${error.message}`);
      }
    }

  } catch (error) {
    console.error('❌ All voice tests failed:', error.message);
  }
}

testWithDifferentVoices();