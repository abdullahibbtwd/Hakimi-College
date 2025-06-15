"use client";
import React from "react";
import { motion } from "framer-motion";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useAppContex } from "@/context/AppContext";

const Navbar = () => {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const { role } = useAppContex();
  return (
    <div className="flex justify-between gap-5 p-4  w-full">
      <nav className="relative z-[20] w-full">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4, ease: "easeInOut" }}
          className="container py-3 flex justify-between items-center"
        >
          {/* Logo Section */}
          <div className="flex px-10 items-center">
            <h1 className="font-bold text-2xl hidden md:flex">HAKIMI COLLEGE TWD</h1>
            <h1 className="font-bold text-2xl md:hidden">HCTWD</h1>
          </div>

          {/* Button Section */}
          {isLoaded && isSignedIn && (
            <div className="flex gap-4">
             
              <button 
                className="inline-block bg-[#f7ba34] text-white font-semibold py-2 px-6 rounded-lg hover:bg-[#69a79c] cursor-pointer duration-200"
                  
              onClick={()=> router.push(`/${role}`)}>
                Dashboard
              </button>

              {/* Clerk's User Button */}
              <UserButton
                afterSignOutUrl="/"
                userProfileUrl="/user-profile" // Still link to your custom UserProfile page
              />
            </div>
          )}
          {isLoaded && !isSignedIn && (
            <SignInButton mode="modal">
              <button className="inline-block bg-[#f7ba34] text-white font-semibold py-2 px-6 rounded-lg hover:bg-[#69a79c] cursor-pointer duration-200 ">
                Sign In
              </button>
            </SignInButton>
          )}

     
        </motion.div>
      </nav>
    </div>
  );
};

export default Navbar;
