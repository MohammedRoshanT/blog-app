const axios = require('axios');

async function simpleTest() {
  const baseURL = 'http://localhost:3000';
  
  // Create a session that maintains cookies
  const session = axios.create({
    baseURL,
    withCredentials: true
  });

  try {
    console.log('1. Testing home page...');
    const homeResponse = await session.get('/');
    console.log('Home page status:', homeResponse.status);
    
    console.log('\n2. Testing login page...');
    const loginResponse = await session.get('/login');
    console.log('Login page status:', loginResponse.status);
    
    console.log('\n3. Testing register page...');
    const registerResponse = await session.get('/register');
    console.log('Register page status:', registerResponse.status);
    
    console.log('\n4. Testing posts page...');
    const postsResponse = await session.get('/posts');
    console.log('Posts page status:', postsResponse.status);
    
    console.log('\n5. Testing new post page (should redirect to login)...');
    try {
      const newPostResponse = await session.get('/posts/new');
      console.log('New post page status:', newPostResponse.status);
      console.log('Response URL:', newPostResponse.request.res.responseUrl);
    } catch (error) {
      console.log('New post page error:', error.response?.status);
      console.log('Redirect location:', error.response?.headers?.location);
    }
    
  } catch (error) {
    console.error('Test error:', error.message);
  }
}

simpleTest();
