// src/app/profile/[id]/page.jsx

import React, { use } from "react";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/src/app/(Backend)/lib/authOptions";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const userName = session?.user?.name || "User";
  console.log(userName, id);

  return {
    title: `${userName} - Details | KiddoMart`,
    description: `Account details for ID: ${id}`,
  };
}

const MyDetails = async ({ params }) => {
  // 1. Params await kora (Next.js 15 rule)
  const { id } = await params;

  const session = await getServerSession(authOptions);

  // 2. Session check
  if (!session) {
    redirect("/auth/login");
  }

  const user = session?.user;

  console.log(user);

  // 3. Authorization check
  // sub ba id duitai check kora bhalo karon provider bhede field change hoy
  if (user?.id !== id && user?.sub !== id) {
    return notFound(); // Unauthorized hole direct 404 ba 403 dekhano bhalo
  }

  const joinedDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Member since 2026";

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/profile"
          className="text-slate-500 hover:text-blue-500 text-sm flex items-center gap-2 mb-6 transition-colors group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">
            ←
          </span>{" "}
          Back to Profile
        </Link>

        <h1 className="text-3xl font-black mb-8">
          Account <span className="text-blue-500">Details</span>
        </h1>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-700"></div>

          <div className="px-6 md:px-10 pb-10">
            <div className="relative -mt-12 mb-8 flex flex-col md:flex-row items-end gap-5">
              <Image
                src={
                  user?.image ||
                  user?.picture ||
                  `https://ui-avatars.com/api/?name=${user?.name}`
                }
                alt="User Avatar"
                width={120}
                height={120}
                priority // Priority dila image fast load hobe
                className="rounded-2xl border-4 border-slate-900 bg-slate-800 object-cover shadow-xl h-28 w-28 md:h-32 md:w-32"
              />
              <div className="pb-2">
                <h2 className="text-2xl font-bold">{user?.name}</h2>
                <p className="text-slate-400 text-sm tracking-tight">
                  {user?.email}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-800 pt-8">
              <DetailItem label="Full Name" value={user?.name} icon="👤" />
              <DetailItem label="Email Address" value={user?.email} icon="📧" />
              <DetailItem
                label="Phone Number"
                value={user?.phone || "Not provided"}
                icon="📞"
              />
              <DetailItem
                label="Account Role"
                value={user?.role}
                icon="🛡️"
                badge
              />
              <DetailItem label="Joined Date" value={joinedDate} icon="📅" />
              <DetailItem
                label="Status"
                value="Active"
                icon="✅"
                color="text-green-500"
              />
            </div>

            <div className="mt-10 p-4 bg-slate-950/50 border border-slate-800 rounded-xl text-center">
              <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">
                Internal UID: {id}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ label, value, icon, badge, color }) => (
  <div className="group">
    <p className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.2em] flex items-center gap-2 mb-1">
      <span className="opacity-70">{icon}</span> {label}
    </p>
    {badge ? (
      <span className="inline-block bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-lg text-[11px] font-bold uppercase">
        {value}
      </span>
    ) : (
      <p className={`text-slate-200 font-medium truncate ${color}`}>{value}</p>
    )}
  </div>
);

export default MyDetails;
