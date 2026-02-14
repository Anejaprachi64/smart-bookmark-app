// "use client";

// import { useEffect } from "react";
// import { supabase } from "@/lib/supabaseClient";
// import { useRouter } from "next/navigation";

// export default function AuthCallback() {
//   const router = useRouter();

//   useEffect(() => {
//     supabase.auth.getSession().then(() => {
//       router.push("/");
//     });
//   }, [router]);

//   return (
//     <div className="min-h-screen flex items-center justify-center">
//       Logging you in...
//     </div>
//   );
// }
"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(() => {
      router.replace("/");
    });
  }, [router]);

  return <p className="text-center mt-10">Signing you in…</p>;
}
