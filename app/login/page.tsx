"use client";

import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md text-center space-y-6">

        <h1 className="text-2xl font-bold">
          Sign in to Smart Bookmark 🔖
        </h1>

        <button
          onClick={signInWithGoogle}
          className="w-full bg-black text-white py-3 rounded-lg"
        >
          Continue with Google
        </button>
      </div>
    </main>
  );
}
