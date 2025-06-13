import { internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { query, mutation } from "./_generated/server";



// export const upsertFromClerk = internalMutation({
//   args:{data:v.any() as Validator<UserJSON>},
//   async handler(ctx,{data}){
//     const userAttributes = {
//       email:data.email_addresses[0].email_address,
//       clerkUserId:data.id,
//       name:data.first_name ?? undefined,
//       imageUrl:data.image_url ?? undefined
//     }
//    await ctx.db.insert("users",userAttributes)
//   }
// })
// In your users mutation file
// convex/users.ts
// convex/users.ts
// convex/users.ts

export const getCurrentUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    
    return await ctx.db
      .query("users")
      .withIndex("byClerkUserId", (q) => q.eq("clerkUserId", identity.subject))
      .unique();
  },
});

export const getUserRole = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null; 
    const user = await ctx.db
      .query("users")
      .withIndex("byClerkUserId", (q) => q.eq("clerkUserId", identity.subject))
      .unique();
    
    return user?.role ;
  },
});
export const getUserName = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return "student"; // Default for unauthenticated users
    
    const user = await ctx.db
      .query("users")
      .withIndex("byClerkUserId", (q) => q.eq("clerkUserId", identity.subject))
      .unique();
    
    return user?.name ;
  },
});
export const upsertFromClerk = internalMutation({
  args: { data: v.any() }, 
  handler: async (ctx, { data }) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("byClerkUserId", q => q.eq("clerkUserId", data.id))
      .unique();

    if (existingUser) {
      await ctx.db.patch(existingUser._id, {
        email: data.email_addresses[0].email_address,
        name: `${data.first_name} ${data.last_name}`,
        role: data.privateMetadata?.role || "student", // Default to student if not provided
        // other fields...
      });
    } else {
      await ctx.db.insert("users", {
        clerkUserId: data.id,
        email: data.email_addresses[0].email_address,
        name: `${data.first_name} ${data.last_name}`,
        role: data.privateMetadata?.role || "student", // Default to student
        // other fields...
      });
    }
  }
});

export const getRoleAndStatus = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    // Get user
    const user = await ctx.db
      .query("users")
      .withIndex("byClerkUserId", q => q.eq("clerkUserId", identity.subject))
      .unique();

    if (!user) return null;

    // Get student status if user is student
    let studentStatus = null;
    if (user.role === "student") {
      const student = await ctx.db
        .query("students")
        .withIndex("by_userId", q => q.eq("userId", user._id))
        .unique();
      studentStatus = student?.status || "not_started";
    }

    return {
      role: user.role,
      studentStatus,
    };
  },
});

export const getUsers = query({
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

export const getUserByClerkId = query({
  args: { clerkUserId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("byClerkUserId", (q) => q.eq("clerkUserId", args.clerkUserId))
      .first();

    return user;
  },
});

export const updateUserRole = mutation({
  args: {
    userId: v.id("users"),
    role: v.union(v.literal("student"), v.literal("teacher"), v.literal("admin")),
  },
  handler: async (ctx, args) => {
    const { userId, role } = args;
    await ctx.db.patch(userId, { role });
    return true;
  },
});