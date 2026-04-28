import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  const { name, email, password } = await request.json();

  if (!name || !email || !password) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const db = await dbConnect();

  // Demo mode - allow registration without database
  if (!db) {
    // Create a demo token for testing
    const demoToken = jwt.sign(
      { userId: 'demo-user-id', name, email },
      'demo-secret-key',
      { expiresIn: '1d' }
    );

    return NextResponse.json({
      token: demoToken,
      user: { id: 'demo-user-id', name, email },
      isDemo: true,
      message: 'Demo mode: Account created successfully (no database)'
    });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json({ error: 'User already exists' }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashedPassword });
  await user.save();

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: '1d' });

  return NextResponse.json({ token, user: { id: user._id, name, email } });
}