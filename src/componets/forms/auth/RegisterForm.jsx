"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineUser,
  HiOutlinePhone,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineCloudUpload,
} from "react-icons/hi";
import { SiteDomain } from "@/src/app/(Fronted)/utils/BaseUrl";
const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    // 1. Start Loading & Show Toast
    const toastId = toast.loading("Creating your account...");
    setLoading(true);

    try {
      let imageUrl = "";

      // 2. Image Upload to Cloudinary with Folder Structure
      if (data.image && data.image[0]) {
        const formData = new FormData();
        formData.append("file", data.image[0]);
        formData.append("upload_preset", process.env.NEXT_PUBLIC_UPLOAD_PRESET);

        // Organized folder path: kiddomart/users
        formData.append("folder", "kiddomart/users");

        const uploadRes = await axios.post(
          process.env.NEXT_PUBLIC_CLOUDINARY_URL,
          formData,
        );
        imageUrl = uploadRes.data.secure_url;
        console.log("✅ Image Uploaded:", imageUrl);
      }

      // 3. Prepare Final Payload
      const finalPayload = {
        name: data.name,
        email: data.email,
        phone: data.phone || "",
        password: data.password,
        image: imageUrl,
        created_at: new Date().toISOString(),
        updated_at: null,
      };

      // 4. Send Data to Backend API
      const response = await axios.post(
        `${SiteDomain}/api/auth/register`,
        finalPayload,
      );

      if (response.data.success) {
        toast.success("Welcome! Registration Successful 🛍️", {
          id: toastId,
        });
        router.push("/auth/login");
        reset();
        // Optional: Redirect user to login or home
        // router.push("/login");
      } else {
        toast.error(response.data.message || "Failed to register", {
          id: toastId,
        });
      }
    } catch (error) {
      console.error("❌ Registration Error:", error);
      const errorMsg = error.response?.data?.message || "Something went wrong!";
      toast.error(errorMsg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Full Name */}
        <div className="space-y-1">
          <div className="relative group">
            <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors text-lg" />
            <input
              {...register("name", { required: "Name is required" })}
              placeholder="Full Name"
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-600"
            />
          </div>
          {errors.name && (
            <p className="text-red-500 text-[10px] ml-2 font-bold">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1">
          <div className="relative group">
            <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 text-lg" />
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
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 placeholder:text-slate-600"
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-[10px] ml-2 font-bold">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-1">
          <div className="relative group">
            <HiOutlinePhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg" />
            <input
              {...register("phone")}
              placeholder="Phone Number (Optional)"
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 placeholder:text-slate-600"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1">
          <div className="relative group">
            <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg" />
            <input
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Minimum 6 characters" },
              })}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-12 text-sm text-white focus:outline-none focus:border-blue-500 placeholder:text-slate-600"
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
            <p className="text-red-500 text-[10px] ml-2 font-bold">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Cloudinary Image Upload */}
        <div className="pt-2">
          <label className="flex flex-col items-center justify-center w-full h-28 bg-slate-950/50 border-2 border-dashed border-slate-800 rounded-3xl cursor-pointer hover:border-blue-500/50 transition-all group">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <HiOutlineCloudUpload className="text-3xl text-slate-500 group-hover:text-blue-500 transition-colors mb-1" />
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                Upload Avatar
              </p>
            </div>
            <input
              type="file"
              {...register("image")}
              className="hidden"
              accept="image/*"
            />
          </label>
        </div>

        {/* Submit Button */}
        <button
          disabled={loading}
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-4 uppercase tracking-widest text-xs"
        >
          {loading ? "Please Wait..." : "Register Now"}
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
