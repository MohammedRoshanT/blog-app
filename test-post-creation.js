const mongoose = require('mongoose');
const User = require('./models/user');
const Post = require('./models/post');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/blog-app';

async function testPostCreation() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Check if test user exists
    let testUser = await User.findOne({ email: 'test@example.com' });
    
    if (!testUser) {
      // Create test user
      const hashedPassword = await bcrypt.hash('password123', 10);
      testUser = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: hashedPassword
      });
      await testUser.save();
      console.log('Test user created successfully');
    } else {
      console.log('Test user already exists');
    }

    // Test post creation
    const testPost = new Post({
      title: 'Test Post Title',
      content: 'This is a test post content to verify post creation is working properly.',
      author: testUser._id
    });

    await testPost.save();
    console.log('Test post created successfully:', testPost._id);

    // Verify post was saved
    const savedPost = await Post.findById(testPost._id).populate('author', 'username');
    console.log('Saved post details:', {
      id: savedPost._id,
      title: savedPost.title,
      content: savedPost.content,
      author: savedPost.author.username,
      createdAt: savedPost.createdAt
    });

    console.log('Post creation test completed successfully!');
    
  } catch (error) {
    console.error('Error during post creation test:', error);
    if (error.name === 'ValidationError') {
      console.error('Validation errors:', Object.values(error.errors).map(err => err.message));
    }
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

testPostCreation();
