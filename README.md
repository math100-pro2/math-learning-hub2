# MathMastery - Interactive Learning Platform

## Overview

MathMastery is a comprehensive, gamified learning platform with 10,000+ interactive lessons across 10 different subjects. It combines engaging gamification elements like streaks, leaderboards, and points with a beautiful, responsive user interface.

## Features

### 🎮 Gamification
- **Math Points (MP)**: Earn points for completing lessons
- **Streaks**: Maintain daily learning streaks
- **Levels**: Unlock new levels as you earn more points
- **Leaderboard**: Compete with other users globally

### 📚 Lessons (10,000+)
- **Multiple Categories**: Math, Greek, Astrophysics, Coding, Physics, Chemistry, Biology, History, Literature, Philosophy
- **Structured Learning**: Courses → Sections → Units → Lessons
- **3-6 Sections per course**, **10-20 Units per section**, **6-12 Lessons per unit**
- **Full Access**: No restrictions on accessing any lesson

### 👤 User Features
- Account authentication (Email & Password)
- User profiles with progress tracking
- Persistent progress saving

### 💳 Premium Subscription
- Ad-free experience
- Advanced visualizations
- Priority support
- Offline access
- Stripe integration for payments

### 🎨 Design
- Beautiful, modern UI with gradient backgrounds
- **Button Levitation Effects**: Buttons levitate on hover (Duolingo-style)
- Smooth animations and transitions
- Responsive design

## Tech Stack
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **Payments**: Stripe
- **Security**: bcryptjs for password hashing

## Installation

1. **Install dependencies**
```bash
npm install
```

2. **Configure environment**
```bash
cp .env.example .env
```

3. **Start server**
```bash
npm run dev
```

4. **Access application**
Open http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify token

### Lessons (FULL ACCESS)
- `GET /api/lessons` - Get all 10,000+ lessons
- `GET /api/lessons/course/:courseId` - Get lessons by course
- `GET /api/lessons/:id` - Get lesson details
- `POST /api/lessons/:id/submit` - Submit lesson answers

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course details
- `POST /api/courses/:id/enroll` - Enroll in course

### User
- `GET /api/user/:userId` - Get user profile
- `GET /api/user/:userId/stats` - Get statistics
- `POST /api/user/:userId/unlock-premium` - Unlock premium

### Leaderboard
- `GET /api/leaderboard` - Global leaderboard
- `GET /api/leaderboard/rank/:userId` - Get user rank

## License

CC0 1.0 Universal