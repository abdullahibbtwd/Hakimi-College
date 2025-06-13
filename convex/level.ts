import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all levels
export const getLevels = query({
  handler: async (ctx) => {
    const levels = await ctx.db.query("levels").collect();
    return levels;
  },
});

// Initialize default levels
export const initializeLevels = mutation({
  handler: async (ctx) => {
    const defaultLevels = [
      { name: "Level 1", description: "First year students" },
      { name: "Level 2", description: "Second year students" },
      { name: "Graduate", description: "Graduated students" }
    ];

    for (const level of defaultLevels) {
      const existingLevel = await ctx.db
        .query("levels")
        .filter((q) => q.eq(q.field("name"), level.name))
        .first();

      if (!existingLevel) {
        await ctx.db.insert("levels", level);
      }
    }

    return true;
  },
}); 