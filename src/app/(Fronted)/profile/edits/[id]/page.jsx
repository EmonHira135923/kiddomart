import { authOptions } from "@/src/app/(Backend)/lib/authOptions";
import UpdateForm from "@/src/componets/forms/auth/UpdateForm";
import { getServerSession } from "next-auth";
import React from "react";

const UpdateProfile = async () => {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          Update <span className="text-blue-500">Profile</span>
        </h1>
        {/* Pass user data to the client form */}
        <UpdateForm user={session?.user} />
      </div>
    </div>
  );
};

export default UpdateProfile;
