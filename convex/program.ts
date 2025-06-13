// convex/courses.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get all programs
export const getPrograms = query({
  handler: async (ctx) => {
    const programs = await ctx.db.query("program").collect();
    return programs;
  },
});

// Get program by department
export const getProgramByDepartment = query({
  args: { departmentId: v.union(v.id("departments"), v.string()) },
  handler: async (ctx, args) => {
    if (!args.departmentId || args.departmentId === "") {
      return [];
    }
    const programs = await ctx.db
      .query("program")
      .withIndex("by_departmentId", (q) => q.eq("departmentId", args.departmentId))
      .collect();
    return programs;
  },
});

// Add a new course
export const addProgram = mutation({
  args: {
    departmentId: v.id("departments"),
    name: v.string(),
  },
  handler: async ({ db }, { departmentId, name }) => {
    const newProgramId = await db.insert("program", {
      departmentId,
      name,
      level1Count: 0,
      level2Count: 0,
      graduateCount: 0,
    });
    return newProgramId;
  },
});

// Edit a course
export const editProgram = mutation({
  args: {
    programId: v.id("program"),
    name: v.optional(v.string()),
    level1Count: v.optional(v.number()),
    level2Count: v.optional(v.number()),
    graduateCount: v.optional(v.number()),
  },
  handler: async ({ db }, args) => {
    const { programId, ...updates } = args;
    await db.patch(programId, updates);
    return true;
  },
});

// Delete a course
export const deleteProgram = mutation({
  args: { programId: v.id("program") },
  handler: async ({ db }, { programId }) => {
    await db.delete(programId);
    return true;
  },
});

// Mutation to update counts within a course directly (e.g., for individual student actions)
export const updateProgramCounts = mutation({
  args: {
    programId: v.id("program"),
    level1Delta: v.optional(v.number()), // Change in level1Count
    level2Delta: v.optional(v.number()), // Change in level2Count
    graduateDelta: v.optional(v.number()), // Change in graduateCount
  },
  handler: async ({ db }, { programId, level1Delta = 0, level2Delta = 0, graduateDelta = 0 }) => {
    const program = await db.get(programId);
    if (!program) {
      throw new Error("Program not found");
    }

    await db.patch(programId, {
      level1Count: Math.max(0, program.level1Count + level1Delta),
      level2Count: Math.max(0, program.level2Count + level2Delta),
      graduateCount: Math.max(0, program.graduateCount + graduateDelta),
    });

    return true;
  },
});
export const getAllProgram = query({
  handler: async (ctx) => {
    return await ctx.db.query("program").collect();
  },
});

export const getProgramById = query({
  args: { programId: v.id("program") },
  handler: async (ctx, args) => {
    const program = await ctx.db.get(args.programId);
    return program;
  },
});