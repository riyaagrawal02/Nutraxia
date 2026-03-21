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
git clone https://github.com/riyaagrawal02/Nutraxia.git
cd Nutraxia
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Configure environment variables
Create a `.env.local` file in the project root.

```bash
# Database
MONGODB_URI=your_mongodb_connection_string

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret

# OAuth (Google)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# AI Provider Keys (set whichever you use)
GROQ_API_KEY=your_groq_api_key
GEMINI_API_KEY=your_gemini_api_key
```

### 4️⃣ Run the development server
```bash
npm run dev
```

---

## ✅ Scripts

```bash
npm run dev      # start dev server
npm run build    # production build
npm run start    # start production server
npm run lint     # run eslint
```

---

## 🧩 Key Modules (high-level)

- **Auth**: `app/api/auth/[...nextauth]/route.ts`
- **Database**: `lib/db.ts` (or your DB util)
- **AI**: `lib/ai/*` (prompts + provider calls)
- **Models**: `models/*` (Mongoose schemas)

---

## 🔒 Security Notes

- Never commit `.env.local`.
- Rotate API keys if they leak.
- Prefer least-privilege OAuth credentials.

---

## 🗺 Roadmap

- [ ] Danger zone actions (account deletion)
- [ ] Push notifications / email reminders
- [ ] More wearable integrations
- [ ] Export health reports (PDF/CSV)

---

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -m "Add my feature"`
4. Push branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

Add a license (MIT/Apache-2.0/etc.) if you plan to open-source this project.

---

## 📬 Contact

Created by **riyaagrawal02** — feel free to open an issue for questions or suggestions.
