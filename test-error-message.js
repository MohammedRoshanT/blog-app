const axios = require('axios');

async function testErrorMessage() {
  const baseURL = 'http://localhost:3000';
  
  // Create a session that maintains cookies
  const session = axios.create({
    baseURL,
    withCredentials: true
  });

  try {
    console.log('Testing error message flow...');
    
    // Access new post page without authentication
    console.log('1. Accessing /posts/new without authentication...');
    const newPostResponse = await session.get('/posts/new');
    console.log('Status:', newPostResponse.status);
    console.log('Response contains error message:', newPostResponse.data.includes('Please log in to access this page'));
    console.log('Response contains login form:', newPostResponse.data.includes('Sign in to your account'));
    
    // Check if we were redirected to login
    console.log('\n2. Checking if redirected to login...');
    const loginResponse = await session.get('/login');
    console.log('Login page status:', loginResponse.status);
    console.log('Login page contains error message:', loginResponse.data.includes('Please log in to access this page'));
    
  } catch (error) {
    console.error('Test error:', error.message);
  }
}

testErrorMessage();
