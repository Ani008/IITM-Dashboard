// STEP 1: Load environment variables FIRST
const dotenv = require('dotenv');
dotenv.config();

// STEP 2: Then require other files (they can now access process.env)
const mongoose = require('mongoose');
const User = require('./models/User');
const connectDB = require('./config/db');

// These are your fixed credentials
const users = [
  { password: 'Admin@123', role: 'ADMIN' },
  { password: 'User@123', role: 'USER' },
  { password: 'Staff@123', role: 'STAFF' }
];

const seedUsers = async () => {
  try {
    console.log('🔄 Connecting to database...');
    console.log('URI:', process.env.MONGO_URI); // This should show your URI
    
    await connectDB();
    
    // Give database a moment to fully connect
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('🗑️  Clearing existing users...');
    await User.deleteMany();
    
    console.log('📝 Creating new users...');
    await User.create(users);
    
    console.log('✅ Users seeded successfully!');
    console.log('----------------------------');
    console.log('ADMIN - Admin@123');
    console.log('USER - User@123');
    console.log('STAFF - Staff@123');
    console.log('----------------------------');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed!');
    console.error('Error message:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
};

seedUsers();