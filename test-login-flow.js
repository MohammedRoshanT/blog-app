const axios = require('axios');

async function testLoginFlow() {
  const baseURL = 'http://localhost:3000';
  
  // Create a session that maintains cookies
  const session = axios.create({
    baseURL,
    withCredentials: true
  });

  try {
    console.log('Testing complete login flow...');
    
    // Step 1: Register a user
    console.log('1. Registering a user...');
    const registerData = new URLSearchParams({
      username: 'testuser123',
      email: 'testuser123@example.com',
      password: 'password123',
      confirmPassword: 'password123'
    });
    
    const registerResponse = await session.post('/register', registerData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    console.log('Registration status:', registerResponse.status);
    
    // Step 2: Login
    console.log('\n2. Logging in...');
    const loginData = new URLSearchParams({
      email: 'testuser123@example.com',
      password: 'password123'
    });
    
    const loginResponse = await session.post('/login', loginData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    console.log('Login status:', loginResponse.status);
    console.log('Login response URL:', loginResponse.request.res.responseUrl);
    
    // Step 3: Check if we can access protected routes
    console.log('\n3. Testing access to protected routes...');
    const profileResponse = await session.get('/profile');
    console.log('Profile page status:', profileResponse.status);
    console.log('Profile page contains user info:', profileResponse.data.includes('testuser123'));
    
    const newPostResponse = await session.get('/posts/new');
    console.log('New post page status:', newPostResponse.status);
    console.log('New post page contains form:', newPostResponse.data.includes('Create New Post'));
    
  } catch (error) {
    console.error('Test error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testLoginFlow();
