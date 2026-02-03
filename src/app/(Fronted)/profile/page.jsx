import React from "react";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { authOptions } from "../../(Backend)/lib/authOptions";
import MyprofileButtons from "@/src/componets/buttons/MyprofileButtons";

// 🌐 Dynamic Metadata for SEO and Tab Title
export async function generateMetadata() {
  const session = await getServerSession(authOptions);
  const userName = session?.user?.name || "User";
  return {
    title: `${userName} - Profile | KiddoMart`,
    description: `Manage your KiddoMart account settings and details.`,
  };
}

const MyProfile = async () => {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-10">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            My <span className="text-blue-500">Profile</span>
          </h1>
          <span className="text-xs font-mono text-slate-500 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
            Member ID: #{user?.id}
          </span>
        </div>

        {/* Main Profile Card */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-3xl p-6 md:p-12 shadow-2xl">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
            {/* Left: Profile Image with Glow */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <Image
                src={
                  user?.image ||
                  `https://ui-avatars.com/api/?name=${user?.name}&background=0D8ABC&color=fff`
                }
                alt="Profile picture"
                width={160}
                height={160}
                className="relative rounded-full border-4 border-slate-950 object-cover w-32 h-32 md:w-40 md:h-40"
              />
            </div>

            {/* Right: User Information */}
            <div className="flex-1 w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                <InfoBox label="Full Name" value={user?.name} />
                <InfoBox label="Email Address" value={user?.email} />
                <InfoBox
                  label="Phone Number"
                  value={user?.phone || "Not Linked"}
                />
                <div>
                  <label className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em]">
                    Account Role
                  </label>
                  <div className="mt-1">
                    <span className="bg-blue-500/10 text-blue-400 text-xs font-bold px-3 py-1 rounded-md border border-blue-500/20 uppercase">
                      🛡️ {user?.role || "user"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <MyprofileButtons user={user} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Info Component for Clean Code
const InfoBox = ({ label, value }) => (
  <div className="space-y-1">
    <label className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em]">
      {label}
    </label>
    <p className="text-slate-200 font-medium truncate">{value || "N/A"}</p>
  </div>
);

export default MyProfile;
