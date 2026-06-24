import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:3456";
const errors: string[] = [];

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(msg.text());
});

await page.setViewportSize({ width: 1280, height: 800 });
await page.goto(`${BASE}/play`, { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForSelector("canvas", { timeout: 30000 });
await page.waitForTimeout(2000);

const canvas = page.locator("canvas");
const count = await canvas.count();
const box = count > 0 ? await canvas.first().boundingBox() : null;

const hasCanvas = count > 0 && box && box.width > 0 && box.height > 0;

await page.screenshot({
  path: process.env.SCREENSHOT_DESKTOP ?? "viewport-desktop.png",
  fullPage: false,
});

await page.setViewportSize({ width: 375, height: 667 });
await page.waitForTimeout(500);
await page.screenshot({
  path: process.env.SCREENSHOT_MOBILE ?? "viewport-mobile.png",
  fullPage: false,
});

await page.setViewportSize({ width: 667, height: 375 });
await page.waitForTimeout(500);
await page.screenshot({
  path: process.env.SCREENSHOT_LANDSCAPE ?? "viewport-landscape.png",
  fullPage: false,
});

await browser.close();

console.log(JSON.stringify({ hasCanvas, canvasCount: count, box, errors }, null, 2));

if (!hasCanvas || errors.length > 0) {
  process.exit(1);
}