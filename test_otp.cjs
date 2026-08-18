const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ 
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox'] 
  });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  
  page.on('response', response => {
    if (response.url().includes('identitytoolkit') || response.url().includes('recaptcha')) {
      console.log('FB RESPONSE:', response.url(), response.status());
    }
  });

  try {
    console.log("Navigating to localhost...");
    await page.goto('http://localhost:5175', { waitUntil: 'networkidle0' });

    console.log("Waiting for Sign Up button...");
    await page.waitForSelector('button.btn-primary');
    
    // Just evaluate JS in the page to trigger the auth function directly
    console.log("Injecting trigger code...");
    const result = await page.evaluate(async () => {
      // Find the "Continue with Phone Number" button if it exists
      const btns = Array.from(document.querySelectorAll('button'));
      const signUpBtn = btns.find(b => b.textContent.includes('Sign Up'));
      if (signUpBtn) signUpBtn.click();
      
      await new Promise(r => setTimeout(r, 500));
      
      const phoneBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Continue with Phone Number'));
      if (phoneBtn) phoneBtn.click();
      
      await new Promise(r => setTimeout(r, 500));
      
      const telInput = document.querySelector('input[type="tel"]');
      if (telInput) {
        // use React setter hack or just normal input
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        nativeInputValueSetter.call(telInput, '1234567890');
        telInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
      
      const sendBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Send SMS Code'));
      if (sendBtn) {
        sendBtn.click();
        return "Clicked Send SMS Code";
      }
      return "Could not click Send SMS Code";
    });
    
    console.log("Evaluation Result:", result);
    
    // Wait for the toast error to appear
    console.log("Waiting for error...");
    await new Promise(r => setTimeout(r, 5000));
    
  } catch (e) {
    console.error('ERROR:', e);
  } finally {
    await browser.close();
  }
})();
