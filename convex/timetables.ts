import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";

export const addTimetable = mutation({
  args: {
    departmentId: v.id("departments"),
    programId: v.id("program"),
    level: v.string(),
    semester: v.string(),
    schedule: v.array(
      v.object({
        day: v.string(),
        slots: v.array(
          v.object({
            startTime: v.string(),
            endTime: v.string(),
            courseId: v.id("courses"),
            teacherId: v.optional(v.id("teachers")),
            classroom: v.optional(v.string()),
          })
        ),
      })
    ),
  },
  handler: async (ctx, args) => {
    try {
      // Validate department exists
      const department = await ctx.db.get(args.departmentId);
      if (!department) {
        throw new ConvexError("Department not found");
      }

      // Validate program exists
      const program = await ctx.db.get(args.programId);
      if (!program) {
        throw new ConvexError("Program not found");
      }

      // Validate schedule structure
      if (!args.schedule || args.schedule.length === 0) {
        throw new ConvexError("Schedule is required");
      }

      // Validate each slot has required fields
      for (const day of args.schedule) {
        for (const slot of day.slots) {
          if (!slot.courseId) {
            throw new ConvexError(`Course ID is required for ${day.day}`);
          }
          if (!slot.startTime || !slot.endTime) {
            throw new ConvexError(`Time is required for ${day.day}`);
          }
        }
      }

      const timetableId = await ctx.db.insert("timetables", args);
      return timetableId;
    } catch (error) {
      console.error("Error in addTimetable:", error);
      throw new ConvexError(`Failed to create timetable: ${error}`);
    }
  },
});

export const updateTimetable = mutation({
  args: {
    id: v.id("timetables"),
    departmentId: v.id("departments"),
    programId: v.id("program"),
    level: v.string(),
    semester: v.string(),
    schedule: v.array(
      v.object({
        day: v.string(),
        slots: v.array(
          v.object({
            startTime: v.string(),
            endTime: v.string(),
            courseId: v.id("courses"),
            teacherId: v.optional(v.id("teachers")),
            classroom: v.optional(v.string()),
          })
        ),
      })
    ),
  },
  handler: async (ctx, args) => {
    try {
      const { id, ...updates } = args;
      
      // Log the incoming data
      console.log("Updating timetable with data:", JSON.stringify(updates, null, 2));
      
      // Check if timetable exists
      const existingTimetable = await ctx.db.get(id);
      if (!existingTimetable) {
        console.error("Timetable not found with ID:", id);
        throw new ConvexError("Timetable not found");
      }

      // Log the existing timetable
      console.log("Existing timetable:", JSON.stringify(existingTimetable, null, 2));

      // Validate department exists
      const department = await ctx.db.get(updates.departmentId);
      if (!department) {
        console.error("Department not found with ID:", updates.departmentId);
        throw new ConvexError("Department not found");
      }

      // Validate program exists
      const program = await ctx.db.get(updates.programId);
      if (!program) {
        console.error("Program not found with ID:", updates.programId);
        throw new ConvexError("Program not found");
      }

      // Validate schedule structure
      if (!updates.schedule || updates.schedule.length === 0) {
        console.error("Schedule is empty");
        throw new ConvexError("Schedule is required");
      }

      // Validate each slot has required fields
      for (const day of updates.schedule) {
        for (const slot of day.slots) {
          if (!slot.courseId) {
            console.error(`Course ID is missing for ${day.day}`);
            throw new ConvexError(`Course ID is required for ${day.day}`);
          }
          if (!slot.startTime || !slot.endTime) {
            console.error(`Time is missing for ${day.day}`);
            throw new ConvexError(`Time is required for ${day.day}`);
          }
        }
      }

      // Perform the update
      await ctx.db.patch(id, updates);
      
      // Verify the update
      const updatedTimetable = await ctx.db.get(id);
      console.log("Updated timetable:", JSON.stringify(updatedTimetable, null, 2));
      
      return true;
    } catch (error) {
      console.error("Error in updateTimetable:", error);
      throw new ConvexError(`Failed to update timetable: ${error}`);
    }
  },
});

export const deleteTimetable = mutation({
  args: { id: v.id("timetables") },
  handler: async (ctx, { id }) => {
    try {
      console.log("Attempting to delete timetable with ID:", id);
      
      // Check if timetable exists
      const existingTimetable = await ctx.db.get(id);
      if (!existingTimetable) {
        console.error("Timetable not found with ID:", id);
        throw new ConvexError("Timetable not found");
      }

      console.log("Found timetable to delete:", JSON.stringify(existingTimetable, null, 2));
      await ctx.db.delete(id);
      console.log("Successfully deleted timetable");
      
      return true;
    } catch (error) {
      console.error("Error in deleteTimetable:", error);
      throw new ConvexError(`Failed to delete timetable: ${error}`);
    }
  },
});

export const getTimetables = query({
  handler: async (ctx) => {
    try {
      return await ctx.db.query("timetables").collect();
    } catch (error) {
      console.error("Error in getTimetables:", error);
      throw new ConvexError(`Failed to fetch timetables: ${error}`);
    }
  },
});

export const getTimetableById = query({
  args: { id: v.id("timetables") },
  handler: async (ctx, { id }) => {
    try {
      const timetable = await ctx.db.get(id);
      if (!timetable) {
        throw new ConvexError("Timetable not found");
      }
      return timetable;
    } catch (error) {
      console.error("Error in getTimetableById:", error);
      throw new ConvexError(`Failed to fetch timetable: ${error}`);
    }
  },
});

export const getTimetableByDepartmentAndProgram = query({
  args: {
    departmentId: v.id("departments"),
    programId: v.id("program"),
    level: v.string(),
    semester: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const timetable = await ctx.db
        .query("timetables")
        .withIndex("by_department_program", (q) =>
          q.eq("departmentId", args.departmentId).eq("programId", args.programId)
        )
        .filter((q) => q.eq(q.field("level"), args.level))
        .filter((q) => q.eq(q.field("semester"), args.semester))
        .unique();
      
      return timetable;
    } catch (error) {
      console.error("Error in getTimetableByDepartmentAndProgram:", error);
      throw new ConvexError(`Failed to fetch timetable: ${error}`);
    }
  },
});