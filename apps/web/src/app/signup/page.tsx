"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Signup successful! Please login.");
      router.push("/login");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl w-96">
        <h2 className="text-2xl font-bold text-center text-purple-600 mb-6">
          Create Account ✨
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
          onClick={handleSignup}
          className="w-full bg-purple-500 text-white p-3 rounded-lg hover:bg-purple-600 transition"
        >
          Sign Up
        </button>

        <p className="text-sm text-center mt-4">
          Already have account?{" "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => router.push("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}