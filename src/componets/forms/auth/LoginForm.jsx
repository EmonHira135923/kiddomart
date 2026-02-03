"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react"; // Import signIn
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
} from "react-icons/hi";
import SocialButton from "./SocialButton";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const toastId = toast.loading("Verifying your account...");
    setLoading(true);

    try {
      // NextAuth SignIn function call
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false, // Redirect false rakhlam jate amra error handle korte pari
      });

      if (res?.error) {
        toast.error("Invalid Email or Password", { id: toastId });
      } else {
        toast.success("Login Successful! Redirecting...", { id: toastId });
        router.refresh(); // Session update korar jonno
        router.push("/"); // Home page-e redirect
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Field */}
        <div className="space-y-1">
          <div className="relative group">
            <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 text-lg transition-colors" />
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email address",
                },
              })}
              type="email"
              placeholder="Email Address"
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 placeholder:text-slate-600 transition-all"
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-[10px] ml-2 font-bold uppercase">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-1">
          <div className="relative group">
            <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 text-lg transition-colors" />
            <input
              {...register("password", { required: "Password is required" })}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-12 text-sm text-white focus:outline-none focus:border-blue-500 placeholder:text-slate-600 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
            >
              {showPassword ? (
                <HiOutlineEyeOff size={18} />
              ) : (
                <HiOutlineEye size={18} />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-[10px] ml-2 font-bold uppercase">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          disabled={loading}
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98] disabled:opacity-50 uppercase tracking-widest text-xs"
        >
          {loading ? "Verifying..." : "Sign In"}
        </button>
      </form>

      {/* Social Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-800"></div>
        </div>
        <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest text-slate-500">
          <span className="bg-slate-900/40 px-3 backdrop-blur-md">
            Or continue with
          </span>
        </div>
      </div>

      <SocialButton />

      <p className="text-center text-slate-500 text-[11px] font-bold uppercase tracking-widest mt-6">
        New to KiddoMart?{" "}
        <Link
          href="/auth/reg"
          className="text-blue-500 hover:text-blue-400 transition-colors"
        >
          Create Account
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
