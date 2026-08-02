const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  
  async function runTest(width, height, name) {
     console.log(`Running test for ${name} (${width}x${height})`);
     const page = await browser.newPage();
     await page.setViewport({ width, height });
     
     page.on('console', msg => {
         if(msg.type() === 'error') console.log(`[${name}] PAGE ERROR LOG:`, msg.text());
     });
     page.on('pageerror', err => console.log(`[${name}] PAGE EXCEPTION:`, err.toString()));

     await page.goto('http://localhost:4173/');
     await new Promise(r => setTimeout(r, 4000)); // wait for splash screen
     
     try {
         // Click Sign Up
         const buttons = await page.$$('button');
         for (let b of buttons) {
             const text = await page.evaluate(el => el.textContent, b);
             if (text.includes('Sign Up')) {
                 await b.click();
                 break;
             }
         }
         await new Promise(r => setTimeout(r, 500));
         
         // Click Continue with Email
         const emailBtn = await page.$$('button');
         for (let b of emailBtn) {
             const text = await page.evaluate(el => el.textContent, b);
             if (text.includes('Continue with Email')) {
                 await b.click();
                 break;
             }
         }
         await new Promise(r => setTimeout(r, 500));
         
         // Type Email
         await page.type('input[type="email"]', 'test@example.com');
         
         // Click Email Verification
         const verifyBtn = await page.$$('button');
         for (let b of verifyBtn) {
             const text = await page.evaluate(el => el.textContent, b);
             if (text.includes('Email Verification')) {
                 await b.click();
                 break;
             }
         }
         await new Promise(r => setTimeout(r, 1500));
         
     } catch (e) {
         console.log(`[${name}] TEST SCRIPT ERROR:`, e);
     }
     await page.close();
  }
  
  await runTest(375, 812, 'Mobile');
  await runTest(768, 1024, 'Tablet');
  await runTest(1440, 900, 'Desktop');
  
  console.log("All tests done");
  await browser.close();
})();
