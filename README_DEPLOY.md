
# 🚀 WhatsApp Store SaaS - Deployment Guide

Your project successfully fixed the "Shareable Link" and "QR Code" issues!
It is now ready for deployment as a "Fullstack" app using **Supabase (PostgreSQL)**.

## ✅ Fixes Applied
1.  **Fixed Link Generation**: The store link (`/s/storename`) is now generated correctly for Vercel.
2.  **Added QR Code**: A working QR code now appears on the Dashboard (using `api.qrserver.com`).
3.  **Cloud Sync Enabled**: The app is upgraded to sync data with Supabase (PostgreSQL), allowing shared links to work for everyone (not just on your local device).

---

## 🛠️ Step 1: Set up Supabase (Database)
Since you want to use PostgreSQL, you need a free Supabase project.

1.  Go to [Supabase.com](https://supabase.com/) and create a new project.
2.  Go to the **SQL Editor** in Supabase side menu.
3.  Open the file `db_schema.sql` (included in your project files).
4.  Copy the content of `db_schema.sql` and paste it into the Supabase SQL Editor.
5.  Click **Run**. This will create your `users`, `stores`, and `products` tables.

## 🔑 Step 2: Configure Environment Variables
You need to connect your app to Supabase.

1.  In Supabase, go to **Project Settings > API**.
2.  Copy the **Project URL** and **anon public key**.
3.  Create a file named `.env` (or `.env.local`) in your project folder and add:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_GEMINI_API_KEY=your_gemini_key_here
```

## ☁️ Step 3: Deploy to Vercel
1.  Push your code to **GitHub**.
2.  Go to **Vercel Dashboard** -> New Project -> Import from GitHub.
3.  In "Environment Variables" section on Vercel:
    *   Add `VITE_SUPABASE_URL`
    *   Add `VITE_SUPABASE_ANON_KEY`
    *   Add `VITE_GEMINI_API_KEY`
4.  Click **Deploy**.

## 📱 How to Test
1.  Open your deployed app.
2.  Sign up/Login.
3.  Go to **Dashboard**.
4.  The "Link" and "QR Code" will now be visible.
5.  When you "Save" a product or store setting, it will save to Supabase.
6.  Share the link! It will work for anyone because it fetches data from the cloud.

---
**Note:** If you run the app without Supabase keys, it will fallback to "Demo Mode" (saving to browser only), so shared links won't work for others.
