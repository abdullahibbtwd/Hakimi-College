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
            <h1 className="font-bold text-2xl ">JICOHSAT</h1>
          </div>

          {/* Button Section */}
          {isLoaded && isSignedIn && (
            <div className="flex gap-4">
              {/* {userData?.role === "student" &&
                userData.studentStatus === "progress" ? (
                  <button
                    onClick={() => router.push(`progress`)}
                    className="inline-block bg-[#f7ba34] text-white font-semibold py-2 px-6 rounded-lg hover:bg-[#69a79c] cursor-pointer duration-200"
                  >
                    Dashboard
                  </button>
                ): userData?.studentStatus === 'rejected' ? <> 
                <button onClick={() => router.push(`rejection`)}
                    className="inline-block bg-[#f7ba34] text-white font-semibold py-2 px-6 rounded-lg hover:bg-[#69a79c] cursor-pointer duration-200"
                  >
                    Dashboard
                  </button></>: userData?.studentStatus !== "rejected" || 'progress' || "admitted"  ? <>
                  <button
                onClick={() => router.push(`application`)}
                className="inline-block bg-[#f7ba34] text-white font-semibold py-2 px-6 rounded-lg hover:bg-[#69a79c] cursor-pointer duration-200"
              >
                Dashboard
              </button>
                  </> : userData.role === "admin" ? <><button
                onClick={() => router.push(`admin`)}
                className="inline-block bg-[#f7ba34] text-white font-semibold py-2 px-6 rounded-lg hover:bg-[#69a79c] cursor-pointer duration-200"
              >
                Dashboard
              </button></>:<><button
                onClick={() => router.push(`${role}`)}
                className="inline-block bg-[#f7ba34] text-white font-semibold py-2 px-6 rounded-lg hover:bg-[#69a79c] cursor-pointer duration-200"
              >
                Dashboard
              </button></>  } */}
              {/* if (userData.role === 'student') {
      switch (userData.studentStatus) {
        case 'progress':
          if (!pathname.startsWith('/progress')) {
            shouldRedirect = true;
            targetPath = '/progress';
          }
          break;
        case 'admitted':
          if (!pathname.startsWith('/student')) {
            shouldRedirect = true;
            targetPath = '/student';
          }
          break;
        case 'rejected':
          if (!pathname.startsWith('/rejection')) {
            shouldRedirect = true;
            targetPath = '/rejection';
          }
          break;
        default:
          if (!pathname.startsWith('/application')) {
            shouldRedirect = true;
            targetPath = '/application';
          }
      }
    } */}
              <button onClick={()=> router.push(`/${role}`)}>
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

          {/* <SignInButton mode="modal">
            <button
          
        className='inline-block bg-[#f7ba34] text-white font-semibold py-2 px-6 rounded-lg hover:bg-[#69a79c]  cursor-pointer duration-200 '>Sign In</button>
         
          </SignInButton> */}
        </motion.div>
      </nav>
    </div>
  );
};

export default Navbar;
