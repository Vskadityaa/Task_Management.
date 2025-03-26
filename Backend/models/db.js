import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

// Verify that the MONGODB_URI is being loaded properly
if (!process.env.MONGODB_URI) {
  console.error("MongoDB URI not found. Please check your .env file.");
  process.exit(1); // Exit the application if URI is missing
}

// Connect to MongoDB using the MONGODB_URI from .env
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB Connected...');
  })
  .catch((error) => {
    console.error('MongoDB Connection Error:', error);
  });
