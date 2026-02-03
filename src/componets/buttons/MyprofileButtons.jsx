import Link from "next/link";
import React from "react";

const MyprofileButtons = ({ user }) => {
  console.log("user", user);
  return (
    <div>
      <div className="flex flex-col sm:flex-row items-center gap-4 mt-10">
        <Link
          href={`/profile/edits/${user?.id}`}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-2"
        >
          ✏️ Update Profile
        </Link>
        <Link
          href={`/profile/${user?.id}`}
          className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-slate-200 px-8 py-3 rounded-xl font-bold transition-all border border-slate-700 text-center flex items-center justify-center gap-2"
        >
          📄 View Details
        </Link>
      </div>
    </div>
  );
};

export default MyprofileButtons;
