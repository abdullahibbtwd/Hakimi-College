"use client"
import Image from "next/image"
import { useAppContex } from '@/context/AppContext';
import { UserButton, useUser } from "@clerk/nextjs";

const Navbar = () => {
       const {  role,name  } = useAppContex();
         const { isSignedIn, isLoaded } = useUser();
  return (
    <div className='flex items-center justify-between p-4'>
       {/* SEARCH BAR */}
        <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-500 px-2">
            <Image src="/search.png" alt="" width={14} height={14}/>
            <input type="text" placeholder="Search..." className="w-[200px] p-2 bg-transparent outline-none" />
        </div>
            {/* Icon And User */}

            <div className="flex items-center gap-4 justify-end w-full ">
                <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer">
                    <Image src="/message.png" alt="" width={20} height={20}/>
                </div>
                <div className="bg-white relative rounded-full w-7 h-7 flex items-center justify-center cursor-pointer">
                    <Image src="/announcement.png" alt="" width={20} height={20}/>
                    <div className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-purple-500 text-xs rounded-full text-white">1</div>
                </div>
                <div className="flex flex-col">
                    <span className="text-xs leading-3 font-medium">{name}</span>
                    <span className="text-[10px] text-gray-500 text-right">
                        {role}
                    </span>
                </div>
                 {isLoaded && isSignedIn && (
              <div className="flex gap-4">
                <UserButton
                  afterSignOutUrl="/"
                  userProfileUrl="/user-profile" // Still link to your custom UserProfile page
                />
              </div>
            )}
    </div>
    </div>
  )
}

export default Navbar