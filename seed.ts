import { config } from 'dotenv';
config({ path: '.env.local' });
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User';

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI!);

  const existingUser = await User.findOne({ email: 'test@example.com' });
  if (existingUser) {
    console.log('Sample user already exists');
    return;
  }

  const hashedPassword = await bcrypt.hash('password123', 10);
  const user = new User({
    name: 'Test User',
    email: 'test@example.com',
    password: hashedPassword,
  });
  await user.save();

  console.log('Sample user created:');
  console.log('Email: test@example.com');
  console.log('Password: password123');

  await mongoose.disconnect();
}

seed().catch(console.error);