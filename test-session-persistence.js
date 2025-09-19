const axios = require('axios');

async function testSessionPersistence() {
  const baseURL = 'http://localhost:3000';
  
  // Create a session that maintains cookies
  const session = axios.create({
    baseURL,
    withCredentials: true
  });

  try {
    console.log('Testing session persistence...');
    
    // Step 1: Register and login
    console.log('1. Registering and logging in...');
    const registerData = new URLSearchParams({
      username: 'sessiontest',
      email: 'sessiontest@example.com',
      password: 'password123',
      confirmPassword: 'password123'
    });
    
    await session.post('/register', registerData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    
    const loginData = new URLSearchParams({
      email: 'sessiontest@example.com',
      password: 'password123'
    });
    
    const loginResponse = await session.post('/login', loginData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    console.log('Login response URL:', loginResponse.request.res.responseUrl);
    
    // Step 2: Check if we're authenticated by accessing profile
    console.log('\n2. Checking authentication status...');
    const profileResponse = await session.get('/profile');
    console.log('Profile page status:', profileResponse.status);
    console.log('Profile page contains user info:', profileResponse.data.includes('sessiontest'));
    
    // Step 3: Check new post page
    console.log('\n3. Checking new post page...');
    const newPostResponse = await session.get('/posts/new');
    console.log('New post page status:', newPostResponse.status);
    console.log('New post page URL:', newPostResponse.request.res.responseUrl);
    console.log('New post page contains form:', newPostResponse.data.includes('Create New Post'));
    console.log('New post page contains login form:', newPostResponse.data.includes('Sign in to your account'));
    
    // Step 4: Check if we can access posts
    console.log('\n4. Checking posts page...');
    const postsResponse = await session.get('/posts');
    console.log('Posts page status:', postsResponse.status);
    console.log('Posts page contains posts:', postsResponse.data.includes('All Posts'));
    
    // Step 5: Try to create a post
    console.log('\n5. Attempting to create a post...');
    const postData = new URLSearchParams({
      title: 'Session Test Post',
      content: 'This is a test post to verify session persistence.'
    });
    
    const createPostResponse = await session.post('/posts', postData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    console.log('Create post status:', createPostResponse.status);
    console.log('Create post response URL:', createPostResponse.request.res.responseUrl);
    
  } catch (error) {
    console.error('Test error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
    }
  }
}

testSessionPersistence();
