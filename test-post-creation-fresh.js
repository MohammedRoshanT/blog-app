const axios = require('axios');

async function testPostCreationFresh() {
  const baseURL = 'http://localhost:3000';
  
  // Create a session that maintains cookies
  const session = axios.create({
    baseURL,
    withCredentials: true
  });

  try {
    console.log('Testing post creation with fresh server...');
    
    // Step 1: Check if server is running
    console.log('1. Checking server status...');
    const homeResponse = await session.get('/');
    console.log('Home page status:', homeResponse.status);
    
    // Step 2: Register a new user
    console.log('\n2. Registering a new user...');
    const registerData = new URLSearchParams({
      username: 'testuser456',
      email: 'testuser456@example.com',
      password: 'password123',
      confirmPassword: 'password123'
    });
    
    const registerResponse = await session.post('/register', registerData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    console.log('Registration status:', registerResponse.status);
    console.log('Registration response URL:', registerResponse.request.res.responseUrl);
    
    // Step 3: Login
    console.log('\n3. Logging in...');
    const loginData = new URLSearchParams({
      email: 'testuser456@example.com',
      password: 'password123'
    });
    
    const loginResponse = await session.post('/login', loginData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    console.log('Login status:', loginResponse.status);
    console.log('Login response URL:', loginResponse.request.res.responseUrl);
    
    // Step 4: Test access to new post page
    console.log('\n4. Testing access to new post page...');
    const newPostResponse = await session.get('/posts/new');
    console.log('New post page status:', newPostResponse.status);
    console.log('New post page contains form:', newPostResponse.data.includes('Create New Post'));
    console.log('New post page contains error:', newPostResponse.data.includes('Error loading post'));
    
    // Step 5: Try to create a post
    console.log('\n5. Attempting to create a post...');
    const postData = new URLSearchParams({
      title: 'Test Post Title',
      content: 'This is a test post content to verify post creation is working properly.'
    });
    
    const createPostResponse = await session.post('/posts', postData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    console.log('Create post status:', createPostResponse.status);
    console.log('Create post response URL:', createPostResponse.request.res.responseUrl);
    console.log('Post creation successful:', createPostResponse.status === 200 || createPostResponse.status === 302);
    
    // Step 6: Check if post was created
    console.log('\n6. Checking if post was created...');
    const postsResponse = await session.get('/posts');
    console.log('Posts page status:', postsResponse.status);
    console.log('Posts page contains our post:', postsResponse.data.includes('Test Post Title'));
    
  } catch (error) {
    console.error('Test error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data snippet:', error.response.data.substring(0, 500));
    }
  }
}

testPostCreationFresh();
