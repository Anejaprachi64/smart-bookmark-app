



"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

type Bookmark = {
  id: string;
  title: string;
  url: string;
};

export default function Home() {
  const router = useRouter();

  const [userId, setUserId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");

  const [darkMode, setDarkMode] = useState(false);

  // 🌙 Dark mode
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // 🔐 Get logged-in user
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.push("/login");
        return;
      }

      setUserId(data.user.id);
    };

    getUser();
  }, [router]);

  // 📥 Fetch bookmarks
  const fetchBookmarks = async (uid: string) => {
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", uid)
      .order("created_at", { ascending: false });

    setBookmarks(data || []);
  };

  useEffect(() => {
    if (userId) fetchBookmarks(userId);
  }, [userId]);


  // 🔥 REALTIME SUBSCRIPTION
  useEffect(() => {
    if (!userId) return;

    fetchBookmarks(userId);

    const channel = supabase
      .channel("realtime-bookmarks")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookmarks" },
        () => {
          fetchBookmarks(userId);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);
  // ➕ Add bookmark
  const addBookmark = async () => {
    if (!title || !url || !userId) return;

    const { error } = await supabase.from("bookmarks").insert([
      {
        title,
        url,
        user_id: userId,
      },
    ]);

    if (!error) {
      setTitle("");
      setUrl("");
      fetchBookmarks(userId);
    }
  };

  // 🗑 Delete bookmark
  const deleteBookmark = async (id: string) => {
    await supabase.from("bookmarks").delete().eq("id", id);
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  // ✏ Update bookmark
  const updateBookmark = async (id: string) => {
    const { error } = await supabase
      .from("bookmarks")
      .update({
        title: editTitle,
        url: editUrl,
      })
      .eq("id", id);

    if (!error && userId) {
      setEditingId(null);
      setEditTitle("");
      setEditUrl("");
      fetchBookmarks(userId);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white dark:bg-gray-800 text-black dark:text-white rounded-2xl shadow-xl p-6 space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Smart Bookmark App 🔖</h1>

          <div className="flex gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-3 py-1 rounded border"
            >
              {darkMode ? "🌞 Light" : "🌙 Dark"}
            </button>

            <button
              onClick={() => supabase.auth.signOut().then(() => router.push("/login"))}
              className="px-3 py-1 rounded bg-red-600 text-white"
            >
              Logout
            </button>
          </div>
        </div>



        

        {/* Add bookmark */}
        <div className="space-y-3">
          <input
            className="w-full border rounded-lg p-2 dark:bg-gray-700"
            placeholder="Bookmark title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            className="w-full border rounded-lg p-2 dark:bg-gray-700"
            placeholder="Bookmark URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <button
            onClick={addBookmark}
            className="w-full bg-black text-white rounded-lg py-2"
          >
            Add Bookmark
          </button>
        </div>

        {/* Bookmark list */}
        <ul className="space-y-3">
          {bookmarks.map((b) => (
            <li
              key={b.id}
              className="border rounded-lg p-3 dark:bg-gray-700"
            >
              {editingId === b.id ? (
                <div className="space-y-2">
                  <input
                    className="w-full p-2 rounded border dark:bg-gray-600"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                  <input
                    className="w-full p-2 rounded border dark:bg-gray-600"
                    value={editUrl}
                    onChange={(e) => setEditUrl(e.target.value)}
                  />

                  <div className="flex gap-2">
                    <button
                      onClick={() => updateBookmark(b.id)}
                      className="px-3 py-1 bg-green-600 text-white rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1 bg-gray-400 text-white rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <a
                    href={b.url}
                    target="_blank"
                    className="text-blue-600 dark:text-blue-400 underline"
                  >
                    {b.title}
                  </a>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingId(b.id);
                        setEditTitle(b.title);
                        setEditUrl(b.url);
                      }}
                      className="px-3 py-1 bg-yellow-500 text-white rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteBookmark(b.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
