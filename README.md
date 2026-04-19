# Task Tracker with AI Summaries

A full-stack task management application built with Next.js, featuring user authentication, CRUD operations for tasks, and AI-powered summaries using OpenAI.

## Features

- User registration and login with JWT authentication
- Create, read tasks (full CRUD planned)
- AI-generated summaries of task lists using OpenAI GPT
- Responsive UI with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **AI**: OpenAI API

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables in `.env.local`:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secret key for JWT
   - `OPENAI_API_KEY`: Your OpenAI API key
4. Start MongoDB locally or use a cloud service like MongoDB Atlas
5. Run the development server: `npm run dev`
6. Open [http://localhost:3000](http://localhost:3000)

## API Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/tasks` - Get user's tasks
- `POST /api/tasks` - Create a new task
- `POST /api/summarize` - Get AI summary of tasks

## Deployment

Deploy to Vercel or any platform supporting Next.js. Ensure environment variables are set in the deployment settings.
