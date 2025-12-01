// Test authentication endpoints
import fetch from 'node-fetch';

async function testAuth() {
  console.log('🧪 Testing Authentication Endpoints...\n');
  
  // Test login
  try {
    console.log('1. Testing login...');
    const loginResponse = await fetch('http://localhost:5000/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });
    
    const loginResult = await loginResponse.json();
    
    if (loginResponse.ok) {
      console.log('✅ Login successful!');
      console.log('Token:', loginResult.token ? 'Generated' : 'Missing');
      console.log('User:', JSON.stringify(loginResult.user, null, 2));
      
      // Test token verification
      if (loginResult.token) {
        console.log('\n2. Testing token verification...');
        const verifyResponse = await fetch('http://localhost:5000/v1/auth/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: loginResult.token })
        });
        
        const verifyResult = await verifyResponse.json();
        
        if (verifyResponse.ok) {
          console.log('✅ Token verification successful!');
          console.log('Valid:', verifyResult.valid);
          console.log('User:', JSON.stringify(verifyResult.user, null, 2));
        } else {
          console.log('❌ Token verification failed:', verifyResult);
        }
      }
    } else {
      console.log('❌ Login failed:', loginResult);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testAuth();
