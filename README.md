# Nutraxia 🥗🏋️‍♀️  
**Smart Health & Habit Companion**

Nutraxia is a full-stack wellness platform that helps users build healthier habits through activity tracking, workout planning, AI-powered insights, and personalized routines.

Built with a product-first mindset — not just features.

---

## ✨ Features

### 🔐 Authentication
- Google OAuth + Credentials Login
- JWT-based sessions
- Secure protected routes

### 📊 Dashboard
- Daily stats (steps, water, meals, sleep)
- Weekly trend graphs (Recharts)
- Real-time habit updates
- AI-generated daily health insights

### 🧠 AI Integrations
- AI diet plan generator
- AI workout plan generator
- Daily AI health summary
- Profile completion gate (AI unlock at ≥70%)

### 🏋️ Workout Module
- Manual workout plans
- AI-generated workout plans
- Mark workout as completed
- Workout streak tracking

### ⏰ Routines & Reminders
- Daily habit tracking
- Add / complete / delete routines
- Upcoming reminders view

### ⚙️ Settings
- Theme switch (dark / light)
- Preferences toggles
- Account controls
- Danger zone (future-ready)

---

## 🛠 Tech Stack

**Frontend**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Recharts

**Backend**
- Next.js API routes
- MongoDB + Mongoose
- NextAuth.js

**AI**
- Gemini / Groq APIs
- Prompt-engineered outputs
- Cached AI responses

---

## 📁 Project Architecture

- `app/` → App Router (UI + API)
- `models/` → MongoDB schemas
- `lib/` → Auth, DB, AI logic
- `components/` → Reusable UI
- Modular & scalable structure

---

## 🚀 Getting Started

### 1️⃣ Clone repo
```bash
git clone https://github.com/yourusername/nutraxia.git
cd nutraxia
