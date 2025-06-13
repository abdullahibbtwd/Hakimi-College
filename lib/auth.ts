// For Clerk v5 or newer
// import { getAuth } from "@clerk/nextjs/server";
// import type { NextApiRequest } from "next";

// // For server components
// export async function getAuthToken(t) {
//   try {
//     const auth = getAuth();
//     return await auth.getToken({ template: "convex" });
//   } catch (error) {
//     return error;
//   }
// }
import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest } from "next";

// For server components
export async function getAuthToken(req: NextApiRequest) {
  try {
    const auth = getAuth(req);
    return await auth.getToken({ template: "convex" });
  } catch (error) {
    console.error("Error fetching auth token:", error);
    return null;
  }
}

// Alternative for older Clerk versions
// export async function getAuthToken() {
//   return null; // Remove in production
// }