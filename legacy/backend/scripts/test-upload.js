// Test script for upload endpoint
import fetch from 'node-fetch';

const testImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

async function testUpload() {
  try {
    console.log('Testing upload endpoint...');
    
    const response = await fetch('http://localhost:5000/v1/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dataUrl: testImage,
        folder: 'test'
      })
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Upload successful:', result);
    } else {
      console.log('❌ Upload failed:', result);
    }
  } catch (error) {
    console.error('❌ Error testing upload:', error.message);
  }
}

async function testHealth() {
  try {
    console.log('Testing health endpoint...');
    
    const response = await fetch('http://localhost:5000/health');
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Health check successful:', result);
    } else {
      console.log('❌ Health check failed:', result);
    }
  } catch (error) {
    console.error('❌ Error testing health:', error.message);
  }
}

// Run tests
testHealth();
testUpload();
