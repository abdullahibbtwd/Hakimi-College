"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";

const Announcement = () => {
  const router = useRouter();
  
  // Get current user from Convex
  const currentUser = useQuery(api.users.getCurrentUser);
  
  const announcements = useQuery(api.announcements.get, {
    role: currentUser?.role || "student",
  });

  return (
    <div className='bg-white p-4 rounded-md'>
      <div className="flex items-center justify-between">
        <h1 className="text-[16px] font-semibold my-4 text-gray-500">Announcement</h1>
        <span 
          className="text-xs cursor-pointer text-gray-400 hover:text-gray-600"
          onClick={() => router.push('/list/announcements')}
        >
          View All
        </span>
      </div>
      <div className="flex flex-col gap-3">
        {announcements?.slice(0, 3).map((announcement) => (
          <div 
            key={announcement._id} 
            className="bg-[#EDF9F0] rounded-md p-4 cursor-pointer hover:bg-[#e5f5ea] transition-colors"
            onClick={() => router.push('/list/announcements')}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-[14px] font-medium text-gray-600">
                {announcement.title}
              </h2>
              <span className="text-[10px] px-1 text-gray-500 bg-white rounded-md">
                {new Date(announcement.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-[10px] text-gray-400 line-clamp-2">
              {announcement.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Announcement;