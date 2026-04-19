import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Task from '@/models/Task';
import { verifyToken } from '@/lib/auth';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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

  if (decoded.userId === 'demo-user-id') {
    return NextResponse.json({ summary: 'Demo summary: You have demo tasks to complete, including a demo task 1 and demo task 2.' });
  }

  const db = await dbConnect();
  if (!db) {
    return NextResponse.json({ summary: 'Database unavailable. Use the demo account at /login for a working example.' });
  }

  const tasks = await Task.find({ userId: decoded.userId });
  const taskTitles = tasks.map(t => t.title).join(', ');

  const prompt = `Summarize the following tasks: ${taskTitles}`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
  });

  const summary = completion.choices[0].message.content;

  return NextResponse.json({ summary });
}