const axios = require('axios');
const cheerio = require('cheerio');

async function testWebInterface() {
  try {
    const baseURL = 'http://localhost:3000';
    
    // Test 1: Access post creation without authentication
    console.log('Test 1: Accessing /posts/new without authentication...');
    try {
      const response = await axios.get(`${baseURL}/posts/new`);
      console.log('Status:', response.status);
      console.log('Response contains login redirect:', response.data.includes('Sign in to your account'));
    } catch (error) {
      console.log('Error accessing /posts/new:', error.response?.status, error.response?.statusText);
    }

    // Test 2: Register a new user
    console.log('\nTest 2: Registering a new user...');
    try {
      const registerResponse = await axios.post(`${baseURL}/register`, {
        username: 'webtestuser',
        email: 'webtest@example.com',
        password: 'password123',
        confirmPassword: 'password123'
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        maxRedirects: 0,
        validateStatus: function (status) {
          return status >= 200 && status < 400; // Accept redirects
        }
      });
      console.log('Registration status:', registerResponse.status);
    } catch (error) {
      console.log('Registration error:', error.response?.status, error.response?.statusText);
    }

    // Test 3: Login
    console.log('\nTest 3: Logging in...');
    const session = axios.create({
      baseURL,
      withCredentials: true,
      maxRedirects: 0,
      validateStatus: function (status) {
        return status >= 200 && status < 400; // Accept redirects
      }
    });

    try {
      const loginResponse = await session.post('/login', {
        email: 'webtest@example.com',
        password: 'password123'
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      console.log('Login status:', loginResponse.status);
    } catch (error) {
      console.log('Login error:', error.response?.status, error.response?.statusText);
    }

    // Test 4: Access post creation with authentication
    console.log('\nTest 4: Accessing /posts/new with authentication...');
    try {
      const newPostResponse = await session.get('/posts/new');
      console.log('New post page status:', newPostResponse.status);
      console.log('Response contains create form:', newPostResponse.data.includes('Create New Post'));
    } catch (error) {
      console.log('Error accessing new post page:', error.response?.status, error.response?.statusText);
    }

    // Test 5: Create a post
    console.log('\nTest 5: Creating a post...');
    try {
      const createPostResponse = await session.post('/posts', {
        title: 'Web Test Post',
        content: 'This is a test post created through the web interface to verify everything is working correctly.'
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      console.log('Create post status:', createPostResponse.status);
      console.log('Post creation successful:', createPostResponse.status === 200 || createPostResponse.status === 302);
    } catch (error) {
      console.log('Error creating post:', error.response?.status, error.response?.statusText);
      if (error.response?.data) {
        console.log('Error details:', error.response.data);
      }
    }

  } catch (error) {
    console.error('Test error:', error.message);
  }
}

testWebInterface();
