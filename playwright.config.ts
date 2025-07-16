import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    headless: false,
    storageState: 'storage/amazon.json',
    viewport: { width: 1600, height: 1000 },
    launchOptions: {
      slowMo: 800,        // 0.8 s after **every** Playwright action
    },
  },
  workers: 1,             // keep it serial to stay human‑like
});
