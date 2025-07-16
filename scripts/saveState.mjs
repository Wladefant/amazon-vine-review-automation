import { chromium } from '@playwright/test';
import fs from 'fs';

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 300 });
  const context = await browser.newContext();        // fresh profile
  const page = await context.newPage();

  // Go to login page
  await page.goto('https://www.amazon.de/ap/signin');

  console.log('\n⏳  Log in manually, pass any 2‑FA, then press ENTER in this terminal.');
  process.stdin.resume();
  await new Promise(res => process.stdin.once('data', res));

  // Persist cookies + localStorage
  await fs.promises.mkdir('storage', { recursive: true });
  await context.storageState({ path: 'storage/amazon.json' });
  await browser.close();
  console.log('✅  Session saved to storage/amazon.json');
})();
