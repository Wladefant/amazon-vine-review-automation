import { defineConfig } from '@playwright/test';
import fs from 'fs';

export default defineConfig({
  use: {
    headless: process.env.HEADLESS !== 'false',
    storageState: fs.existsSync('storage/amazon.json') ? 'storage/amazon.json' : undefined,
    viewport: { width: 1600, height: 1000 },
    launchOptions: {
      slowMo: 800,        // 0.8 s after **every** Playwright action
    },
  },
  workers: 1,             // keep it serial to stay human‑like
});
