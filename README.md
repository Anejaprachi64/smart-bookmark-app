#  Smart Bookmark App
A simple, secure, real-time bookmark manager built as part of a screening task for a **Fullstack / GenAI role**.

---

##  Live Demo

 **Live App (Vercel):**  
https://smart-bookmark-app-vercel-k1q7kzbnn-prachi-s-projects-588fac81.vercel.app

 **GitHub Repository:**  
https://github.com/Anejaprachi64/smart-bookmark-app

---

##  Features

-  **Google Authentication only** (no email/password)
-  Add bookmarks (Title + URL)
-  Bookmarks are **private to each user**
-  **Real-time updates** (no page refresh needed)
-  Delete own bookmarks
-  Light/Dark mode
-  Fully deployed on **Vercel**

---

##  Tech Stack

- **Next.js 14** (App Router)
- **Supabase**
  - Authentication (Google OAuth)
  - PostgreSQL Database
  - Realtime subscriptions
  - Row Level Security (RLS)
- **Tailwind CSS**
- **Vercel** (Deployment)

---

##  Authentication Flow

- Users sign in using **Google OAuth**
- Supabase handles authentication
- Session is managed securely
- Unauthorized users are redirected to `/login`

---

##  Data Security (RLS)

Row Level Security is enabled on the `bookmarks` table.

Policies ensure:
- Users can **read only their own bookmarks**
- Users can **insert bookmarks only with their own user_id**
- Users can **delete only their own bookmarks**

---

##  Real-time Updates

Supabase Realtime is used to listen for changes on the `bookmarks` table.

- Open the app in two tabs
- Add or delete a bookmark in one tab
- Changes appear instantly in the other tab

---

##  Challenges Faced & Solutions

### Google OAuth Redirect Issues
- Fixed by configuring correct redirect URLs in Supabase and Google Cloud Console.

### RLS Blocking Data
- Added proper RLS policies using `auth.uid()`.

### Real-time Sync
- Implemented Supabase Realtime subscriptions.

### Deployment Errors
- Fixed missing environment variables on Vercel.

---

##  How to Test

1. Open the live URL
2. Sign in with Google
3. Add/Delete bookmarks
4. Open another tab to verify real-time updates

---

##  Conclusion

This project demonstrates secure authentication, real-time data handling, proper backend security using RLS, and clean frontend architecture with Next.js App Router.
