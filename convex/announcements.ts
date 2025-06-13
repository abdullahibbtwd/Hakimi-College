import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const create = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    targetRoles: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), identity.email))
      .first();

    if (!user || user.role !== "admin") {
      throw new Error("Only admins can create announcements");
    }

    const announcementId = await ctx.db.insert("announcements", {
      title: args.title,
      content: args.content,
      targetRoles: args.targetRoles,
      createdBy: user._id,
      createdAt: Date.now(),
    });

    return announcementId;
  },
});

export const get = query({
  args: {
    role: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), identity.email))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // If user is admin, return all announcements
    if (user.role === "admin") {
      const announcements = await ctx.db
        .query("announcements")
        .order("desc")
        .collect();

      const announcementsWithUser = await Promise.all(
        announcements.map(async (announcement) => {
          const creator = await ctx.db.get(announcement.createdBy);
          return {
            ...announcement,
            createdBy: creator,
          };
        })
      );

      return announcementsWithUser;
    }

    // For non-admin users, return only relevant announcements
    const announcements = await ctx.db
      .query("announcements")
      .filter((q) => 
        q.or(
          q.eq(q.field("targetRoles"), ["both"]),
          q.eq(q.field("targetRoles"), [args.role])
        )
      )
      .order("desc")
      .collect();

    const announcementsWithUser = await Promise.all(
      announcements.map(async (announcement) => {
        const creator = await ctx.db.get(announcement.createdBy);
        return {
          ...announcement,
          createdBy: creator,
        };
      })
    );

    return announcementsWithUser;
  },
}); 