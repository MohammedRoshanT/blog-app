const mongoose = require('mongoose');
const User = require('./models/user');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/blog-app';

async function debugSession() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Check if test user exists
    const testUser = await User.findOne({ email: 'testuser123@example.com' });
    console.log('Test user found:', !!testUser);
    if (testUser) {
      console.log('User details:', {
        id: testUser._id,
        username: testUser.username,
        email: testUser.email
      });
    }

    // Check if there are any sessions in the database
    const sessionCollection = mongoose.connection.db.collection('sessions');
    const sessions = await sessionCollection.find({}).toArray();
    console.log('Number of sessions in database:', sessions.length);
    
    if (sessions.length > 0) {
      console.log('Sample session:', sessions[0]);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

debugSession();
