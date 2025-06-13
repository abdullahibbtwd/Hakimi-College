import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getExamTimetables = query({
  handler: async (ctx) => {
    const exams = await ctx.db.query("examTimetable").collect();
    return exams;
  },
});

// Get exam timetables for a specific teacher
export const getTeacherExamTimetables = query({
  args: { teacherId: v.id("teachers") },
  handler: async (ctx, args) => {
    const exams = await ctx.db
      .query("examTimetable")
      .filter((q) => 
        q.or(
          q.eq(q.field("teacherId"), args.teacherId),
          q.eq(q.field("invigilatorId"), args.teacherId)
        )
      )
      .collect();
    return exams;
  },
});

// Get exam timetables for a specific program and semester
export const getProgramExamTimetables = query({
  args: { 
    programId: v.id("program"),
    semester: v.string()
  },
  handler: async (ctx, args) => {
    const exams = await ctx.db
      .query("examTimetable")
      .filter((q) => 
        q.and(
          q.eq(q.field("programId"), args.programId),
          q.eq(q.field("semester"), args.semester)
        )
      )
      .collect();
    return exams;
  },
});

// Add a new exam timetable
export const addExamTimetable = mutation({
  args: {
    courseId: v.id("courses"),
    teacherId: v.id("teachers"),
    invigilatorId: v.optional(v.id("teachers")),
    examHall: v.string(),
    date: v.string(),
    startTime: v.string(),
    endTime: v.string(),
    semester: v.string(),
    programId: v.id("program"),
    levelId: v.id("levels"),
  },
  handler: async (ctx, args) => {
    const examId = await ctx.db.insert("examTimetable", {
      courseId: args.courseId,
      teacherId: args.teacherId,
      invigilatorId: args.invigilatorId,
      examHall: args.examHall,
      date: args.date,
      startTime: args.startTime,
      endTime: args.endTime,
      semester: args.semester,
      programId: args.programId,
      levelId: args.levelId,
      createdAt: new Date().toISOString(),
    });
    return examId;
  },
});

// Update an exam timetable
export const updateExamTimetable = mutation({
  args: {
    id: v.id("examTimetable"),
    courseId: v.optional(v.id("courses")),
    teacherId: v.optional(v.id("teachers")),
    invigilatorId: v.optional(v.id("teachers")),
    examHall: v.optional(v.string()),
    date: v.optional(v.string()),
    startTime: v.optional(v.string()),
    endTime: v.optional(v.string()),
    semester: v.optional(v.string()),
    programId: v.optional(v.id("program")),
    levelId: v.optional(v.id("levels")),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

// Delete an exam timetable
export const deleteExamTimetable = mutation({
  args: { id: v.id("examTimetable") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
}); 