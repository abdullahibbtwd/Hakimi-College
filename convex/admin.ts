// // convex/admin.ts
// import { mutation } from "./_generated/server";
// import { v } from "convex/values";
// import { internal } from "./_generated/api"; 
// // Helper function to check if the current user is an admin
// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// const isAdmin = async (ctx: any) => {
//   const identity = await ctx.auth.getUserIdentity();
//   if (!identity) return false;
//   const user = await ctx.db
//     .query("users")
//     .withIndex("byClerkUserId", (q) => q.eq("clerkUserId", identity.subject))
//     .unique();
//   return user && user.role === "admin";
// };

// export const updateUserRole = mutation({
//   args: {
//     userId: v.id("users"), // The Convex _id of the user to update
//     newRole: v.union(v.literal("student"), v.literal("teacher"), v.literal("admin")),
//   },
//   handler: async (ctx, args) => {
//     if (!(await isAdmin(ctx))) {
//       throw new Error("Unauthorized: Only admins can change user roles.");
//     }

//     const userToUpdate = await ctx.db.get(args.userId);
//     if (!userToUpdate) {
//       throw new Error("User not found.");
//     }

//     await ctx.db.patch(args.userId, { role: args.newRole });

//     // Optional: If changing to teacher, create a teacher entry
//     if (args.newRole === "teacher") {
//       const existingTeacher = await ctx.db.query("teachers")
//         .filter(q => q.eq(q.field("userId"), args.userId))
//         .unique();
//       if (!existingTeacher) {
//         await ctx.db.insert("teachers", { userId: args.userId, subjectTaught: "Unassigned" }); // Default subject
//       }
//     }
//     // Optional: If changing to student, ensure student entry exists
//     if (args.newRole === "student") {
//         const existingStudent = await ctx.db.query("students")
//             .filter(q => q.eq(q.field("userId"), args.userId))
//             .unique();
//         if (!existingStudent) {
//             // Create a basic student entry if one doesn't exist
//             await ctx.db.insert("students", {
//                 userId: args.userId,
//                 registrationStatus: "submitted", // Assume they've registered if manually set to student
//                 applicationFormData: { fullName: userToUpdate.fullName || "N/A", dateOfBirth: "N/A", address: "N/A", previousSchool: "N/A" },
//                 admissionDecision: "pending",
//             });
//         }
//     }


//     return true;
//   },
// });