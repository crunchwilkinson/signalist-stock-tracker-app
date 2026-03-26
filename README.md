# 📈 Signalist - AI-Powered Stock Market Tracker

![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)

**Signalist** is a modern, full-stack Next.js web application designed to give retail investors a professional-grade dashboard. It combines real-time financial data, advanced charting, and AI-driven background workflows to deliver highly personalized daily stock market summaries directly to users' inboxes.

## ✨ Key Features

* **🤖 AI-Generated Daily Summaries:** Leverages **Google Gemini 2.5 Flash Lite** to synthesize raw market news into personalized, easily digestible email digests based on a user's specific watchlist and investment goals.
* **⏱️ Robust Background Workflows:** Utilizes **Inngest** for reliable, serverless background job orchestration. Handles asynchronous tasks like welcome emails and scheduled cron jobs (daily news delivery) without blocking the main application thread.
* **📊 Advanced Financial Charting:** Integrates **TradingView** lightweight widgets to provide interactive candlestick charts, market heatmaps, and deep technical analysis for individual stocks.
* **⚡ Real-Time Stock Search:** Features a lightning-fast, debounced command-palette search built with shadcn/ui, pulling live ticker data via the **Finnhub API**.
* **🔐 Secure Authentication:** End-to-end user authentication and session management powered by **Better Auth** and securely stored in **MongoDB**.

## 🛠️ Tech Stack

**Frontend:**
* [Next.js 16](https://nextjs.org/) (App Router, Server Actions)
* [React](https://react.dev/) & [TypeScript](https://www.typescriptlang.org/)
* [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/) (Styling & Components)
* React Hook Form (Client-side validation)

**Backend & Data:**
* [MongoDB](https://www.mongodb.com/) & Mongoose (Database & ORM)
* [Better Auth](https://better-auth.com/) (Authentication)
* [Inngest](https://www.inngest.com/) (Background Jobs & Cron Scheduling)
* Nodemailer (Email Delivery)

**APIs & AI:**
* [Google Gemini API](https://ai.google.dev/) (LLM for text summarization)
* [Finnhub API](https://finnhub.io/) (Real-time stock quotes and market news)
* TradingView Widgets (Embedded financial charts)

## 🚀 Getting Started

To run this project locally, you will need to configure the following environment variables in a `.env` file:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# Authentication
BETTER_AUTH_SECRET=your_generated_secret
BETTER_AUTH_BASE_URL=http://localhost:3000 # Update for production

# APIs & AI
NEXT_PUBLIC_FINNHUB_API_KEY=your_finnhub_key
GEMINI_API_KEY=your_google_ai_key

# Email Delivery
NODEMAILER_EMAIL=your_gmail_address
NODEMAILER_PASSWORD=your_16_char_google_app_password

# Local Development Only
INNGEST_DEV=1
