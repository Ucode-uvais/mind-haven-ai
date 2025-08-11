# 🌿 Mind Haven 2.0  
**Your Sanctuary for Mental Health**  

---

## 📖 Overview  
Mind Haven is an **AI-powered mental health therapy platform** designed to provide accessible and empathetic support for emotional well-being.  
It offers a **safe, private, and judgment-free** space where users can:  
- Engage in real-time chat with a **virtual therapist**  
- Track their moods  
- Gain valuable insights into emotional patterns  

By leveraging **cutting-edge AI** and a **user-centric design**, Mind Haven aims to make mental health care **proactive and empowering** for everyone.

---

## ✨ Features  
- **🕒 24/7 AI-Powered Therapy** – Access empathetic AI agents trained in various therapeutic approaches anytime.  
- **💬 Smart Emotional Analysis** – Advanced NLP & emotion detection for accurate mental state assessments.  
- **📊 Personalized Insights** – Tailored recommendations based on mood and activity patterns.  
- **🎮 Interactive Anxiety Relief Activities** – Enjoy activities like *Breathing Patterns* and *Zen Garden* to reduce stress.  
- **🎵 Meditation Playlists** – Curated calming music to soothe your mind.  
- **📅 Mood & Activity Tracking** – Log and monitor your emotional health over time.  
- **🔒 Privacy First** – Conversations and data are encrypted & confidential.

---

## 🛠 Tech Stack  

### **Frontend**  
- Framework: **Next.js (with Turbopack)**  
- Language: **TypeScript**  
- Styling: **Tailwind CSS**, **shadcn/ui**  
- State Management: **Zustand**, **React Context API**  
- Animation: **Framer Motion**  

### **Backend**  
- Framework: **Express.js**  
- Language: **TypeScript**  
- Database: **MongoDB with Mongoose**  
- Authentication: **JWT** + **bcrypt** for password hashing  
- AI Integration: **Google Gemini AI**  
- Asynchronous Processing: **Inngest**  

### **Why Inngest?**  
Inngest handles background jobs and asynchronous AI tasks.  
- **Faster Responses** – API quickly responds while heavy AI tasks run in the background.  
- **Scalable & Reliable** – Handles retries and scales with user demand.  
- **Clean Architecture** – Keeps AI processing separate from core API functions.  

---

## 🚀 Deployment  
- **Frontend** – Vercel  
- **Backend** – Render  

---

## 📦 Installation & Setup  

### **Prerequisites**  
- Node.js (v18+)  
- npm / yarn / pnpm  

### **Steps**  
1️⃣ Clone the repo  
```bash
git clone https://github.com/Ucode-uvais/mind-haven-ai.git
```

2️⃣ Navigate to project directory

```bash
cd mind-haven-ai
```
3️⃣ Install dependencies (frontend & backend)
```bash
npm install
cd backend
npm install
```
4️⃣ Set up environment variables

Frontend (.env.local)
```bash
NEXT_PUBLIC_BACKEND_API_URL=<your_public_backend_api_url>
```

Backend (src/.env)
```bash
MONGODB_URI=<your_mongodb_connection_string>
GEMINI_API_KEY=<your_gemini_api_key>
JWT_SECRET=<your_jwt_secret>
INNGEST_EVENT_KEY=<your_inngest_event_key>
INNGEST_SIGNING_KEY=<your_inngest_signing_key>
```
5️⃣ Run the development server
```bash
npm run dev
```
Open http://localhost:3000 in your browser.

## 🧭 Usage Guide

- Sign Up / Login – Create your account or log in.
- Dashboard – View your wellness stats and quick actions.
- Start Therapy Session – Begin a chat with your AI therapist.
- Track Your Mood – Log daily moods for insights.
- Activities & Music – Explore anxiety relief exercises and meditation playlists.

## 💙 Our Values & Mission

**Our Mission** – Democratize access to mental health support through ethical AI, making care available anytime, anywhere.
**Our Vision** – A world where mental health support is accessible, private, and personalized, powered by trusted AI.
**Our Values** – Privacy, Innovation, Empathy, and Trust.

## 🤝 Contributing

We welcome contributions!

1.Fork the project
2.Create a feature branch

```bash
Copy
Edit
git checkout -b feature/AmazingFeature
```
3.Commit changes

```bash
Copy
Edit
git commit -m 'Add AmazingFeature'
```
4.Push to branch

```bash
Copy
Edit
git push origin feature/AmazingFeature
```
5.Open a Pull Request

## 📜 License
Distributed under the MIT License. See LICENSE for details.


## **📬 Contact**
Maintainer: Seyyed Uvais
📧 Email: seyyeduvais@gmail.com
🌐 Website: https://seyyeduvais.vercel.com




