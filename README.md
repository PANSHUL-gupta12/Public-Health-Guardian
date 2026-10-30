# 🛡️ Public Health Guardian



> An AI-powered public health intelligence platform designed to bridge the gap between patients, healthcare professionals, and system administrators with role-based access and intelligent tools.

## 🌟 Overview

Public Health Guardian is a comprehensive health platform built with modern web technologies. It leverages AI to provide evidence-based answers, track disease outbreaks in real-time, detect medical misinformation, and incentivize healthy habits through a gamified rewards system. The platform ensures secure medical record management while maintaining strict role-based access control (RBAC) for patients, doctors, and administrators.

## ✨ Key Features

- 🤖 **AI Health Chatbot** — Gemini-powered health Q&A providing accurate, evidence-based responses to user queries.
- 🕵️ **Fake News Detector** — An intelligent tool to verify health claims against trusted medical sources, combating health misinformation.
- 🗺️ **Disease Map** — Interactive real-time disease outbreak tracking to keep users informed about local and global health threats.
- 🧠 **Awareness Quiz** — Gamified quizzes to test health knowledge, educating users while allowing them to earn reward points.
- 🎁 **Health Rewards** — A motivation system where users earn and redeem points for maintaining healthy habits and completing quizzes.
- 📊 **Admin Panel** — Comprehensive system analytics, user management, and audit trails for platform administrators.
- 👤 **User Profiles & History** — Personalized dashboard tracking points, verified claims, and quiz performance.

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI + shadcn/ui
- **State Management & Data Fetching:** React Query (@tanstack/react-query)
- **Routing:** React Router DOM

### Backend & Services
- **Database & Auth:** Supabase (PostgreSQL, Row Level Security, Authentication)
- **AI Integration:** Google Gemini AI API (@google/generative-ai)

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- A Supabase Project
- A Google Gemini API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/PANSHUL-gupta12/Public-Health-Guardian.git
   cd Public-Health-Guardian
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Copy the example environment file and add your actual API keys:
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Run the Development Server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

## 🗄️ Database Setup

The project uses Supabase. You can find the database schema inside the `supabase-schema.sql` file. Run this SQL in your Supabase SQL Editor to set up the necessary tables, Row Level Security (RLS) policies, and functions.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! 
Feel free to check [issues page](https://github.com/PANSHUL-gupta12/Public-Health-Guardian/issues).

## 📄 License

This project is licensed under the ISC License.
