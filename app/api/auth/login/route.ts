import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  // Demo user for testing without DB
  if (email === 'demo@example.com' && password === 'demo123') {
    const token = jwt.sign({ userId: 'demo-user-id' }, process.env.JWT_SECRET!, { expiresIn: '1d' });
    return NextResponse.json({ token, user: { id: 'demo-user-id', name: 'Demo User', email } });
  }

  await dbConnect();

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: '1d' });

  return NextResponse.json({ token, user: { id: user._id, name: user.name, email } });
}