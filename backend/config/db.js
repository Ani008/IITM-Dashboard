const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('Attempting to connect to:', process.env.MONGO_URI); // Debug line
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    console.error('Full error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;