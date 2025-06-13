'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { ImSpinner } from "react-icons/im";
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const userData = useQuery(api.users.getRoleAndStatus);
  
  // Define protected routes (must match server-side)
  const protectedRoutes = [
    '/dashboard',
    '/application',
    '/progress',
    '/student',
    '/teacher',
    '/admin',
    '/rejection'
  ];

  // Check if current route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname?.startsWith(route)
  );

  // Handle student status redirects (client-side fallback)
  useEffect(() => {
    // Only run redirect logic for protected routes with valid user data
    if (isProtectedRoute && userData) {
      if (userData.role === 'student') {
        const status = userData.studentStatus || 'not_started';
        
        if (status === 'progress' && !pathname?.startsWith('/progress')) {
          router.replace('/progress');
        } 
        else if (status === 'rejected' && !pathname?.startsWith('/rejection')) {
          router.replace('/rejection');
        }
        else if (status === 'admitted' && !pathname?.startsWith('/student')) {
          router.replace('/student');
        }
        else if ((!status || status === 'not_started') && !pathname?.startsWith('/application')) {
          router.replace('/application');
        }
      }
    }
  }, [userData, pathname, router, isProtectedRoute]);

  // Show loading spinner only for protected routes
  if (isProtectedRoute && userData === undefined) {
    return (
      <div className="flex flex-col gap-4 h-screen items-center justify-center">
        <ImSpinner className="animate-spin text-9xl text-[#c5ab37]" />
        <p className='text-2xl font-semibold text-[#033750] animate-pulse'>Loading user data...</p>
      </div>
    );
  }

  // Handle protected route access
  if (isProtectedRoute && userData === null) {
    return (
      <div className="flex flex-col gap-6 h-screen items-center justify-center p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-8 py-6 rounded-lg max-w-md text-center">
          <h2 className="text-2xl font-bold mb-2">User Data Not Found</h2>
          <p className="mb-4">
            We couldn&apos;t find your user information. Please try logging in again.
          </p>
          <button
            onClick={() => router.push('/sign-in')}
            className="bg-[#033750] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#022a40] transition-colors"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  // Render children for all routes
  return <>{children}</>;
}