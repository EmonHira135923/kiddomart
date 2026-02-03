import React from "react";

const MyDetailsSkeleton = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12 animate-pulse">
      <div className="max-w-3xl mx-auto">
        {/* Back Link Skeleton */}
        <div className="h-4 w-24 bg-slate-800 rounded mb-6"></div>

        {/* Title Skeleton */}
        <div className="h-10 w-48 bg-slate-800 rounded mb-8"></div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          {/* Top Banner Skeleton */}
          <div className="h-24 bg-slate-800"></div>

          <div className="px-6 md:px-10 pb-10">
            {/* Profile Header Skeleton */}
            <div className="relative -mt-12 mb-8 flex flex-col md:flex-row items-end gap-5">
              <div className="w-[120px] h-[120px] rounded-2xl border-4 border-slate-900 bg-slate-800 shadow-xl"></div>
              <div className="pb-2 space-y-2">
                <div className="h-6 w-40 bg-slate-800 rounded"></div>
                <div className="h-4 w-32 bg-slate-800 rounded"></div>
              </div>
            </div>

            {/* Details Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-800 pt-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-3 w-20 bg-slate-800 rounded"></div>
                  <div className="h-5 w-48 bg-slate-800 rounded"></div>
                </div>
              ))}
            </div>

            {/* Bottom Note Skeleton */}
            <div className="mt-10 h-12 w-full bg-slate-800/50 border border-slate-800 rounded-xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyDetailsSkeleton;
