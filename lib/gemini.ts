import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const MODEL = process.env.GEMINI_MODEL ?? 'gemini-2.0-flash-exp';     // pick Flash or Pro

const generationConfig = {
  temperature: 0.9,         // feel free to tweak
  topK: 32,
  topP: 0.95,
  maxOutputTokens: 1024,
};

export async function draftReview(html: string, prompt: string): Promise<string> {
  const model = genAi.getGenerativeModel({ model: MODEL, generationConfig });
  const result = await model.generateContent(prompt + html);
  return result.response.text();
}
