import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:3456";
const SCRATCH = process.env.SCRATCH ?? ".";
const errors: string[] = [];

const browser = await chromium.launch({ headless: true });

async function captureScreenshot(
  page: import("playwright").Page,
  canvas: import("playwright").Locator,
  path: string,
) {
  try {
    await page.screenshot({ path, timeout: 10000 });
  } catch {
    await canvas.screenshot({ path, timeout: 10000 });
  }
}

async function runViewport(
  name: string,
  width: number,
  height: number,
  screenshotPath: string,
) {
  const page = await browser.newPage();
  page.on("pageerror", (e) => errors.push(`[${name}] ${e.message}`));
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(`[${name}] ${msg.text()}`);
  });

  await page.setViewportSize({ width, height });
  await page.goto(`${BASE}/play`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForSelector("canvas", { timeout: 30000 });
  await page.waitForFunction(
    () => typeof window.__CHESS_TEST__ !== "undefined",
    { timeout: 15000 },
  );
  await page.waitForTimeout(2000);

  const before = await page.evaluate(() => ({
    ts: window.__CHESS_TEST__!.getMoveTimestamp(),
    count: window.__CHESS_TEST__!.getMoveCount(),
  }));

  await page.evaluate(() => {
    window.__CHESS_TEST__!.selectAndMove("e2", "e4");
  });
  await page.waitForTimeout(1000);

  const after = await page.evaluate(() => ({
    ts: window.__CHESS_TEST__!.getMoveTimestamp(),
    count: window.__CHESS_TEST__!.getMoveCount(),
    last: window.__CHESS_TEST__!.getLastMove(),
  }));

  const canvas = page.locator("canvas").first();
  const box = await canvas.boundingBox();

  await captureScreenshot(page, canvas, screenshotPath);

  const result = {
    viewport: name,
    hasCanvas: Boolean(box && box.width > 100 && box.height > 100),
    canvasBox: box,
    moveChanged: after.ts > before.ts && after.count > before.count,
    lastMove: after.last,
  };

  console.log(JSON.stringify(result, null, 2));
  await page.close();
  return result;
}

const desktop = await runViewport(
  "desktop",
  1280,
  800,
  `${SCRATCH}/viewport-desktop.png`,
);
const mobile = await runViewport(
  "mobile-portrait",
  375,
  667,
  `${SCRATCH}/viewport-mobile.png`,
);
const landscape = await runViewport(
  "mobile-landscape",
  667,
  375,
  `${SCRATCH}/viewport-landscape.png`,
);

await browser.close();

const fatalErrors = errors.filter(
  (e) => !e.includes("favicon") && !e.includes("404"),
);

const allOk =
  desktop.hasCanvas &&
  mobile.hasCanvas &&
  landscape.hasCanvas &&
  desktop.moveChanged &&
  mobile.moveChanged &&
  landscape.moveChanged &&
  fatalErrors.length === 0;

console.log(
  JSON.stringify({ allOk, errors: fatalErrors, viewports: [desktop, mobile, landscape] }, null, 2),
);

if (!allOk) process.exit(1);