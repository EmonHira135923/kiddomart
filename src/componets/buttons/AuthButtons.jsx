"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import NavLink from "../Shared/NavLink";

const AuthButtons = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { data: session, status } = useSession();
  const dropdownRef = useRef(null);

  // Dropdown baire click korle bondho hobe
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 1. Loading State
  if (status === "loading") {
    return (
      <div className="flex items-center space-x-3 animate-pulse">
        <div className="hidden lg:block h-3 w-12 bg-slate-800 rounded"></div>
        <div className="h-9 w-9 bg-slate-800 rounded-full"></div>
      </div>
    );
  }

  // 2. Authenticated State
  if (status === "authenticated") {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className="flex items-center focus:outline-none"
        >
          <Image
            height={40}
            width={40}
            src={
              session?.user?.image ||
              `https://ui-avatars.com/api/?name=${session?.user?.name}`
            }
            alt="profile"
            className="w-9 h-9 rounded-full border-2 border-slate-800 hover:border-blue-500 transition-all object-cover"
          />
        </button>

        {isProfileOpen && (
          <div className="absolute right-0 mt-3 w-52 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-2 z-60s animate-in fade-in zoom-in duration-200">
            <div className="px-4 py-3 border-b border-slate-800/60 mb-1">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                Account
              </p>
              <p className="text-sm font-bold text-white truncate">
                {session?.user?.name}
              </p>
            </div>

            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              📊 <span>Dashboard</span>
            </Link>
            <Link
              href="/profile"
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              👤 <span>My Profile</span>
            </Link>

            <hr className="border-slate-800 my-1" />

            <button
              onClick={() => signOut()}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
            >
              🚪 <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  // 3. Unauthenticated State
  return (
    <div className="hidden lg:flex items-center space-x-5">
      <NavLink href="/auth/login">Sign In</NavLink>
      <Link
        href="/auth/reg"
        className="bg-blue-600 text-white px-6 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-blue-500 transition-all active:scale-95 shadow-lg shadow-blue-600/20"
      >
        Join Now
      </Link>
    </div>
  );
};

export default AuthButtons;
