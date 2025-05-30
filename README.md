# Chatbot – Emotion Analysis Conversational Agent

## 🚀 Project Goal
Build an emotion-aware chatbot that holds natural conversations **and** detects the user’s emotional tone in real time.  
By combining conversational AI with sentiment analysis, the bot adapts its replies for a more empathetic, personalised experience, demonstrating how emotional intelligence can enrich human-computer interaction. 

---

## 🛠️ Tech Stack — Quick List
- **Next.js** (React + Node)
- **TypeScript**
- **Tailwind CSS**
- **Supabase** (Postgres DB & Auth)
- **Groq SDK / NLP API** – emotion analysis
- **Web Speech API + React Speech Recognition** – voice I/O
- **React Webcam** – optional camera input
- **Recharts** – data / sentiment charts
- **React Markdown**
- **date-fns** utilities

### **Features:**
- Emotion detection.
- Voice chat (speech-to-text & text-to-speech).

---

## ✨ Key Features
- **Interactive chat UI** – modern, mobile-responsive threaded interface.  
- **Real-time emotion detection** – classifies each user message (happy, sad, angry, etc.) and tailors responses accordingly.  
- **Voice input & output** – speak to the bot and let it talk back using browser speech APIs.  
- **Visual sentiment insights** – charts showing emotion trends across the conversation.  
- **Persistent history & optional auth** – conversations stored securely in Supabase so users can return to past chats.  
- **Modular, extensible codebase** – hooks, services, and components designed for easy feature swaps or additions. 

---

## ⚙️ Installation Guide

1. **Clone the repo**
   ```bash
   git clone https://github.com/ariesanhthu/chatbot.git
   cd chatbot
   ```
2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
  NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
  GROQ_API_KEY=your-groq-api-key
  
  #clerk auth
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-api-key
  CLERK_SECRET_KEY=your-clerk-api-key
  
  #web hooks
  SIGNING_SECRET=your-api-key
```
4. **Run in development**
```bash
npm run dev
# open http://localhost:3000
```
