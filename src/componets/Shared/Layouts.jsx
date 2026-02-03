"use client";
import { usePathname } from "next/navigation";
import React from "react";
import Navvar from "./Navvar";
import Footer from "./Footer";
import NextAuthProvider from "../provider/NextAuthProvider";

const Layouts = ({ children }) => {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/auth");

  return (
    <NextAuthProvider>
      {isAuthPage ? (
        <main>{children}</main>
      ) : (
        // Normal page er jonno Header, Nav, Footer soho layout
        <div className="flex flex-col min-h-screen">
          <header className="sticky top-0 z-50">
            <Navvar />
          </header>

          <main className="flex-grow bg-slate-950 text-white">{children}</main>

          <footer className="bg-slate-950 border-t border-slate-900">
            <Footer />
          </footer>
        </div>
      )}
    </NextAuthProvider>
  );
};

export default Layouts;
