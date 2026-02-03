"use client";
import React, { useState } from "react";
import Link from "next/link";

const MobileMenu = ({ menuItems }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
      >
        <span className="text-2xl">{isOpen ? "✕" : "☰"}</span>
      </button>

      {/* Slide-down Menu */}
      <div
        className={`absolute top-full left-0 w-full bg-slate-950 border-b border-slate-900 md:hidden transition-all duration-300 overflow-hidden ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-4 space-y-3 shadow-2xl">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              onClick={() => setIsOpen(false)}
              className="block py-2 text-slate-400 hover:text-white font-medium transition-colors"
            >
              {item.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-slate-900 grid grid-cols-2 gap-4">
            <Link
              href="/auth/login"
              onClick={() => setIsOpen(false)}
              className="text-center py-2 text-slate-400 text-sm font-bold uppercase tracking-widest"
            >
              Login
            </Link>
            <Link
              href="/auth/reg"
              onClick={() => setIsOpen(false)}
              className="bg-blue-600 text-white text-center py-2 rounded-xl text-xs font-bold uppercase tracking-widest"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
