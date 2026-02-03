"use client";

import React from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

const SocialButton = () => {
  const router = useRouter();

  const handleSignIn = async (provider) => {
    try {
      // NextAuth er signIn function call
      const result = await signIn(provider, {
        redirect: false, // Manual redirection handle korar jonno false
        callbackUrl: "/profile", // Login success hole kothay jabe
      });

      if (result?.error) {
        console.error("Login somoshya:", result.error);
      } else if (result?.url) {
        // Redirection complete kora
        router.push(result.url);
      }
    } catch (error) {
      console.error("Authentication error:", error);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="grid grid-cols-2 gap-4">
        {/* Google Login Button */}
        <button
          type="button"
          onClick={() => handleSignIn("google")}
          className="flex items-center justify-center gap-3 bg-slate-900 border border-slate-800 text-white py-3 rounded-2xl hover:bg-slate-800 transition-all active:scale-95 shadow-xl group"
        >
          <FcGoogle className="text-xl group-hover:scale-110 transition-transform" />
          <span className="text-[11px] font-bold uppercase tracking-wider">
            Google
          </span>
        </button>

        {/* GitHub Login Button */}
        <button
          type="button"
          onClick={() => handleSignIn("github")}
          className="flex items-center justify-center gap-3 bg-slate-900 border border-slate-800 text-white py-3 rounded-2xl hover:bg-slate-800 transition-all active:scale-95 shadow-xl group"
        >
          <FaGithub className="text-xl group-hover:scale-110 transition-transform text-white" />
          <span className="text-[11px] font-bold uppercase tracking-wider">
            GitHub
          </span>
        </button>
      </div>
    </div>
  );
};

export default SocialButton;
