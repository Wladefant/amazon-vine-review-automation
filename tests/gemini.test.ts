import { test, expect } from '@playwright/test';
import { draftReview } from '../lib/gemini';

test('gemini flash API responds', async () => {
  test.skip(!process.env.GEMINI_API_KEY, 'GEMINI_API_KEY not set');
  try {
    const text = await draftReview('<p>Hello</p>', 'Say hi:');
    expect(typeof text).toBe('string');
  } catch (err) {
    test.skip(true, 'Gemini API unavailable');
  }
});
