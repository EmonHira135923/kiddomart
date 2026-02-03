import React from "react";
import Link from "next/link";
import MobileMenu from "./MobileMenu";
import AuthButtons from "../buttons/AuthButtons";
import NavLink from "./NavLink";

const Navvar = () => {
  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "Categories", path: "/categories" },
  ];

  return (
    <nav className="w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Brand Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="group flex items-center">
              <span className="text-xl md:text-2xl font-black text-white tracking-tight uppercase">
                Kiddo
                <span className="text-blue-500 group-hover:text-orange-500 transition-colors">
                  Mart
                </span>
              </span>
            </Link>
          </div>

          {/* Center: Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <NavLink key={item.name} href={item.path}>
                {item.name}
              </NavLink>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Cart Icon */}
            <Link
              href="/cart"
              className="relative p-2 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 transition-colors"
            >
              🛍️
              <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-[9px] font-bold h-4 w-4 flex items-center justify-center rounded-full border border-slate-950">
                0
              </span>
            </Link>

            {/* Desktop Auth Buttons (Client Part) */}
            <AuthButtons />

            {/* Mobile Menu & Toggle (Client Part) */}
            <MobileMenu menuItems={menuItems} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navvar;
