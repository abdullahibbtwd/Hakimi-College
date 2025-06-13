import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    startTime: v.string(),
    endTime: v.string(),
    date: v.string(),
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
      throw new Error("Only admins can create events");
    }

    const eventId = await ctx.db.insert("events", {
      title: args.title,
      description: args.description,
      startTime: args.startTime,
      endTime: args.endTime,
      date: args.date,
      createdBy: user._id,
      createdAt: Date.now(),
    });

    return eventId;
  },
});

export const get = query({
  handler: async (ctx) => {
    const events = await ctx.db
      .query("events")
      .order("desc")
      .collect();

    const eventsWithUser = await Promise.all(
      events.map(async (event) => {
        const creator = await ctx.db.get(event.createdBy);
        return {
          ...event,
          createdBy: creator,
        };
      })
    );

    return eventsWithUser;
  },
}); 