import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Task from '@/models/Task';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);
  if (!decoded) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (decoded.userId === 'demo-user-id') {
    return NextResponse.json([
      { _id: 'demo1', title: 'Demo Task 1', description: 'This is a demo task', completed: false },
      { _id: 'demo2', title: 'Demo Task 2', description: 'Another demo task', completed: true },
    ]);
  }

  const db = await dbConnect();
  if (!db) {
    return NextResponse.json({ error: 'Database unavailable. Please use demo login.' }, { status: 503 });
  }

  const tasks = await Task.find({ userId: decoded.userId });
  return NextResponse.json(tasks);
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);
  if (!decoded) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { title, description } = await request.json();

  if (decoded.userId === 'demo-user-id') {
    const fakeTask = { _id: 'new-demo-' + Date.now(), title, description, completed: false };
    return NextResponse.json(fakeTask, { status: 201 });
  }

  const db = await dbConnect();
  if (!db) {
    return NextResponse.json({ error: 'Database unavailable. Please use demo login.' }, { status: 503 });
  }

  const task = new Task({ title, description, userId: decoded.userId });
  await task.save();

  return NextResponse.json(task, { status: 201 });
}