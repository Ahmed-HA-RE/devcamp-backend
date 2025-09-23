import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export async function connectDB() {
  const connection = await mongoose.connect(process.env.MONGODB_URI);
  console.log(
    `MongoDB is connected on ${connection.connection.name}`.cyan.underline
  );
}
