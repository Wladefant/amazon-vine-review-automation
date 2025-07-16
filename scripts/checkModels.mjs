// scripts/checkModels.mjs
import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';   // ← no “/beta”

const genAi = new GoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
  apiVersion: 'v1beta',        // THIS selects the beta endpoint
});

console.log('🔍  Checking available Gemini models…\n');

try {
  const { models } = await genAi.listModels();      // exists in 0.4+
  console.log('Found', models.length, 'models:\n');
  models.forEach(m => console.log(' •', m.name));
  console.log('\n💡  Example:  export GEMINI_MODEL=gemini-2.5-flash');
} catch (err) {
  console.error('❌  listModels() failed:', err);
}
