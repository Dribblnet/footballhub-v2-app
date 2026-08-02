const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    console.log(`[BROWSER ${msg.type().toUpperCase()}] ${msg.text()}`);
  });

  page.on('pageerror', err => {
    console.log(`[BROWSER ERROR] ${err.toString()}`);
  });

  console.log("Navigating to http://localhost:5174");
  try {
    await page.goto('http://localhost:5174', { waitUntil: 'networkidle0', timeout: 30000 });
    console.log("Navigation finished. Waiting 5 seconds to let React settle...");
    await new Promise(r => setTimeout(r, 5000));
    const html = await page.evaluate(() => document.body.innerHTML);
    if (!html || html.trim() === '' || html.includes('<div id="root"></div>') && html.length < 50) {
      console.log("[RESULT] Blank screen detected.");
    } else {
      console.log(`[RESULT] Page rendered ${html.length} bytes of HTML.`);
    }
  } catch (err) {
    console.error("Failed to load page:", err);
  } finally {
    await browser.close();
  }
})();
