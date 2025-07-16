import { test, expect } from '@playwright/test';
import { draftReview } from '../lib/gemini';
import { splitReview } from '../lib/parseGemini';
import fs from 'fs';

const RAND = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// German prompt for Amazon reviews
const GERMAN_PROMPT = `
Dieses GPT erstellt Rezensionen im Amazon-Stil für Vine-Produkte. Die Bewertungen sollen natürlich und authentisch wirken, als wären sie von echten Kunden geschrieben.

Erstelle eine Rezension mit:
- **[ANZAHL] STERNE** (1-5)
- Titel in \`\`\`markdown\`\`\` Blöcken
- Bewertungstext in separaten \`\`\`markdown\`\`\` Blöcken

Die Rezension soll:
- Authentisch und natürlich klingen
- Produktspezifische Details erwähnen
- Vor- und Nachteile ausgewogen darstellen
- Angemessene Länge haben (2-4 Sätze)
- Deutsche Sprache verwenden

`;

test('write all pending Vine reviews, slowly', async ({ page, context }) => {
  test.skip(!fs.existsSync('storage/amazon.json'), 'login state missing');
  await page.goto('https://www.amazon.de/vine/vine-reviews?review-type=pending_review');

  // ---- helper: sleep random 2‑4 s
  const rest = () => page.waitForTimeout(RAND(2000, 4000));

  for (;;) {
    const links = page.locator('a[name="vvp-reviews-table--review-item-btn"]');
    const n = await links.count();
    if (!n) break;

    for (let i = 0; i < n; i++) {
      const [popup] = await Promise.all([
        context.waitForEvent('page'),
        links.nth(i).click(),   // open review tab
      ]);

      await popup.waitForLoadState('domcontentloaded');

      const html = await popup.content();
      const raw = await draftReview(html, GERMAN_PROMPT);
      const { stars, title, body } = splitReview(raw);

      // title & body with visible typing
      await popup.locator('#review-title')
                 .type(title, { delay: RAND(80, 160) });
      await popup.locator('#review-body')
                 .type(body, { delay: RAND(30, 100) });

      // star click with extra wait
      await popup.locator('div.in-context-ryp__form-field--starRating > span')
                 .nth(stars - 1)
                 .click({ delay: RAND(120, 240) });
      await rest();

      await Promise.all([
        popup.waitForNavigation(),
        popup.locator('input[type="submit"], button:has-text("Absenden")').click()
      ]);

      await popup.close();
      await rest();             // pause before next review link
    }

    // pagination
    const next = page.locator('ul.a-pagination li.a-last a');
    if (await next.isVisible()) {
      await Promise.all([page.waitForLoadState('domcontentloaded'), next.click()]);
      await rest();
    } else break;
  }

  // final idle time so you can see result before Playwright shuts down
  await page.waitForTimeout(5000);
});
