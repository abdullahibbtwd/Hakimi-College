import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Add new screening slot (admin only)
export const addScreeningSlot = mutation({
  args: {
    date: v.string(),
    startTime: v.string(),
    maxCapacity: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // In real app, add admin auth check here
    const maxCapacity = args.maxCapacity || 50;
    
    return await ctx.db.insert("screeningSlots", {
      date: args.date,
      startTime: args.startTime,
      maxCapacity,
      bookings: 0,
    });
  },
});

export const reserveScreeningSlot = mutation({
  handler: async (ctx) => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().slice(0, 5);
    
    const availableSlot = await ctx.db
      .query("screeningSlots")
      .withIndex("by_date")
      .filter(q =>
        q.or(
          q.gt(q.field("date"), today),
          q.and(
            q.eq(q.field("date"), today),
            q.gte(q.field("startTime"), currentTime)
          )
        )
      )
      .filter(q => q.lt(q.field("bookings"), q.field("maxCapacity")))
      .order("asc")
      .first();

    if (!availableSlot) throw new Error("No available screening slots");

    // Update slot bookings
    await ctx.db.patch(availableSlot._id, {
      bookings: availableSlot.bookings + 1
    });

    return {
      slotId: availableSlot._id,
      date: availableSlot.date,
      startTime: availableSlot.startTime,
      location: "Jicohsat auditorium, Jicohsat School, Tudun Wada"
    };
  },
});

// Get next available slot
export const getNextAvailableSlot = query({
  handler: async (ctx) => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    return await ctx.db
      .query("screeningSlots")
      .withIndex("by_bookings")
      .filter(q => 
        q.or(
          q.gt(q.field("date"), today),
          q.and(q.eq(q.field("date"), today), q.gte(q.field("startTime"), now.toTimeString().slice(0,5)))
        )
      )
      .filter(q => q.lt(q.field("bookings"), q.field("maxCapacity")))
      .order("asc")
      .first();
  },
});

export const submitApplication = mutation({
  args: { name: v.string(), email: v.string() },
  handler: async (ctx, args) => {
    // Find the first available slot with capacity
    const availableSlot = await ctx.db
      .query("screeningSlots")
      .filter(q => q.lt(q.field("bookings"), q.field("maxCapacity")))
      .order("asc")
      .first();

    if (!availableSlot) throw new Error("No available screening slots");

    // Update slot bookings
    await ctx.db.patch(availableSlot._id, {
      bookings: availableSlot.bookings + 1
    });

    // Create application
    return await ctx.db.insert("applications", {
      name: args.name,
      email: args.email,
      slotId: availableSlot._id,
    });
  },
});