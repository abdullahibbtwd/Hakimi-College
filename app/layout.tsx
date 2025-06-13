// app/layout.tsx
//import type { Metadata } from "next";
"use client"
import "./globals.css";
import Providers from "@/components/providers";
import { AppContexProvider } from "@/context/AppContext";
import ProtectedLayout from "@/components/ProtectedLayout";
import { usePathname } from "next/navigation";

// export const metadata: Metadata = {
//   title: "Jicohsat",
//   description: "Your app description",
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
   const pathname = usePathname();
  
  // Define protected routes
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
  return (
    <html lang="en">
      <body>
        <Providers><AppContexProvider>
         {isProtectedRoute ? (
          <ProtectedLayout>{children}</ProtectedLayout>
        ) : (
          
          children
        )}
          </AppContexProvider>
        </Providers>
      </body>
    </html>
  );
}
