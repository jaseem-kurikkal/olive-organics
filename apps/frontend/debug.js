import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.toString()));
  
  try {
    await page.goto('http://localhost:5175', { waitUntil: 'networkidle2', timeout: 10000 });
    console.log("Page loaded successfully.");
  } catch (err) {
    console.error("Failed to load page:", err);
  }
  
  await browser.close();
})();
