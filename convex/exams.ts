import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const getExamTimetables = query({
  handler: async (ctx) => {
    const exams = await ctx.db.query("examTimetable").collect();
    return exams;
  },
});

interface Exam {
  _id: Id<"examTimetable">;
  courseId: Id<"courses">;
  teacherId: Id<"teachers">;
  invigilatorId: Id<"teachers">;
  examHall: string;
  date: string;
  startTime: string;
  endTime: string;
  semester: string;
  programId: Id<"program">;
  levelId: Id<"levels">;
}
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
    courseId: v.string(),
    teacherId: v.string(),
    invigilatorId: v.string(),
    examHall: v.string(),
    date: v.string(),
    startTime: v.string(),
    endTime: v.string(),
    semester: v.string(),
    programId: v.string(),
    levelId: v.string(),
  },
  handler: async (ctx, args) => {
    const examId = await ctx.db.insert("examTimetable", {
      // courseId: args.courseId,
      // teacherId: args.teacherId,
      // invigilatorId: args.invigilatorId,
      // examHall: args.examHall,
      // date: args.date,
      // startTime: args.startTime,
      // endTime: args.endTime,
      // semester: args.semester,
      // programId: args.programId,
      // levelId: args.levelId,
        ...args,
      courseId: args.courseId as Id<"courses">,
      teacherId: args.teacherId as Id<"teachers">,
      invigilatorId: args.invigilatorId as Id<"teachers">,
      programId: args.programId as Id<"program">,
      levelId: args.levelId as Id<"levels">,
      createdAt: new Date().toISOString(),
    });
    return examId;
  },
});

// Update an exam timetable
export const updateExamTimetable = mutation({
  args: {
    // id: v.id("examTimetable"),
    // courseId: v.optional(v.id("courses")),
    // teacherId: v.optional(v.id("teachers")),
    // invigilatorId: v.optional(v.id("teachers")),
    // examHall: v.optional(v.string()),
    // date: v.optional(v.string()),
    // startTime: v.optional(v.string()),
    // endTime: v.optional(v.string()),
    // semester: v.optional(v.string()),
    // programId: v.optional(v.id("program")),
    // levelId: v.optional(v.id("levels")),
        id: v.id("examTimetable"),
    // Accept strings and convert to Id types
    courseId: v.optional(v.string()),
    teacherId: v.optional(v.string()),
    invigilatorId: v.optional(v.string()),
    examHall: v.optional(v.string()),
    date: v.optional(v.string()),
    startTime: v.optional(v.string()),
    endTime: v.optional(v.string()),
    semester: v.optional(v.string()),
    programId: v.optional(v.string()),
    levelId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
  //   const { id, ...updates } = args;
  //   await ctx.db.patch(id, updates);
  // },
   const { id, ...rest } = args;
    
    // Convert string IDs to proper Id types
    const updateData: Partial<Exam> = {
      ...rest,
      courseId: rest.courseId ? rest.courseId as Id<"courses"> : undefined,
      teacherId: rest.teacherId ? rest.teacherId as Id<"teachers"> : undefined,
      invigilatorId: rest.invigilatorId ? rest.invigilatorId as Id<"teachers"> : undefined,
      programId: rest.programId ? rest.programId as Id<"program"> : undefined,
      levelId: rest.levelId ? rest.levelId as Id<"levels"> : undefined,
    };

    await ctx.db.patch(id, updateData)
  }
});

// Delete an exam timetable
export const deleteExamTimetable = mutation({
  args: { id: v.id("examTimetable") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
}); 