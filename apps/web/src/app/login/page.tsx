"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl w-96">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Welcome Back 🚀
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-3 border rounded-lg"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-3 border rounded-lg"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition"
        >
          Login
        </button>

        <p className="text-sm text-center mt-4">
          Don't have account?{" "}
          <span
            className="text-purple-600 cursor-pointer font-semibold"
            onClick={() => router.push("/signup")}
          >
            Signup
          </span>
        </p>
      </div>
    </div>
  );
}
  