"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  HiOutlineUser,
  HiOutlinePhone,
  HiOutlineCloudUpload,
  HiOutlineMail,
} from "react-icons/hi";

const UpdateForm = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.name || "",
      phone: user?.phone || "",
    },
  });

  const onSubmit = async (data) => {
    const toastId = toast.loading("Updating your profile...");
    setLoading(true);

    try {
      let imageUrl = user?.image;

      // ১. ক্লাউডিনারি ইমেজ আপলোড (যদি নতুন ফাইল থাকে)
      if (data.image && data.image[0]) {
        const formData = new FormData();
        formData.append("file", data.image[0]);
        formData.append("upload_preset", process.env.NEXT_PUBLIC_UPLOAD_PRESET);
        formData.append("folder", "kiddomart/users");

        const uploadRes = await axios.post(
          process.env.NEXT_PUBLIC_CLOUDINARY_URL,
          formData,
        );
        imageUrl = uploadRes.data.secure_url;
      }

      // ২. শুধুমাত্র নাম, ফোন এবং ইমেজ পাঠানো হচ্ছে (Role বা Email নয়)
      const updatePayload = {
        id: user?.id,
        name: data.name,
        phone: data.phone,
        image: imageUrl,
      };

      const response = await axios.patch(
        `/api/profile/${user?.id}`,
        updatePayload,
      );

      if (response.data.success) {
        toast.success("Profile updated! ✨", { id: toastId });
        router.push("/profile"); // অথবা রিফ্রেশ করুন
        router.refresh();
      } else {
        toast.error(response.data.message || "Update failed", { id: toastId });
      }
    } catch (error) {
      console.error("❌ Update Error:", error);
      toast.error("Something went wrong!", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5 bg-slate-900/50 p-6 rounded-3xl border border-slate-800 shadow-2xl"
      >
        {/* প্রোফাইল ইমেজ সেকশন */}
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="relative w-28 h-28">
            <Image
              src={user?.image || "https://ui-avatars.com/api/?name=User"}
              alt="Profile"
              fill
              className="rounded-full object-cover border-4 border-slate-950 shadow-blue-500/20 shadow-2xl"
            />
          </div>

          <label className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-full cursor-pointer hover:bg-slate-700 transition-all border border-slate-700">
            <HiOutlineCloudUpload className="text-blue-400 text-lg" />
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
              Change Photo
            </span>
            <input
              type="file"
              {...register("image")}
              className="hidden"
              accept="image/*"
            />
          </label>
        </div>

        {/* নাম ইনপুট */}
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-[0.2em]">
            Full Name
          </label>
          <div className="relative">
            <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg" />
            <input
              {...register("name", { required: "Name is required" })}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white focus:border-blue-500 transition-all outline-none"
            />
          </div>
        </div>

        {/* ফোন ইনপুট */}
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-[0.2em]">
            Phone Number
          </label>
          <div className="relative">
            <HiOutlinePhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg" />
            <input
              {...register("phone")}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white focus:border-blue-500 transition-all outline-none"
            />
          </div>
        </div>

        {/* ইমেইল (শুধুমাত্র দেখানোর জন্য - Disabled) */}
        <div className="space-y-1 opacity-60">
          <label className="text-[10px] font-black text-slate-600 uppercase ml-2 tracking-[0.2em]">
            Email (Read Only)
          </label>
          <div className="relative">
            <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 text-lg" />
            <input
              value={user?.email}
              disabled
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-slate-500 cursor-not-allowed"
            />
          </div>
        </div>

        {/* সাবমিট বাটন */}
        <button
          disabled={loading}
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98] disabled:opacity-50 mt-4 uppercase tracking-[0.2em] text-[11px]"
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default UpdateForm;
