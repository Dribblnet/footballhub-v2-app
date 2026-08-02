const http = require('http');

async function testApi() {
  const email = 'test@example.com';
  console.log('Sending OTP request to API...');
  
  const sendReq = await fetch('http://localhost:5000/api/auth/send-email-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  }).catch(e => {
    console.error('Fetch error (is server running?):', e.message);
    process.exit(1);
  });
  
  if (!sendReq) return;
  const sendRes = await sendReq.json();
  console.log('Send OTP Response:', sendRes);
  
  if (sendRes.success) {
    // wait a moment for the server to log
    await new Promise(r => setTimeout(r, 1000));
    
    // We don't know the exact OTP generated, but if we can't read the server logs directly 
    // from this script without the OTP, we can just send an invalid one to see the flow.
    const otp = '123456';
    
    console.log(`Verifying OTP request to API with ${otp}...`);
    const verifyReq = await fetch('http://localhost:5000/api/auth/verify-email-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp })
    });
    
    const verifyRes = await verifyReq.json();
    console.log('Verify OTP Response:', verifyRes);
  }
}

testApi();
