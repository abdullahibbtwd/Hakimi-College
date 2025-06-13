import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const addCourse = mutation({
  args: {
    name: v.string(),
    code: v.string(),
    creditUnit: v.number(),
    semester: v.string(),
    isGeneral: v.boolean(),
    programIds: v.array(v.id("program")),
    teacherIds: v.array(v.id("teachers")),
  },
  handler: async (ctx, args) => {
    const courseId = await ctx.db.insert("courses", args);
    
    // Update teacher profiles with the new course
    for (const teacherId of args.teacherIds) {
      const teacher = await ctx.db.get(teacherId);
      if (teacher) {
        await ctx.db.patch(teacherId, {
          courseIds: [...teacher.courseIds, courseId]
        });
      }
    }
    
    return courseId;
  },
});

export const updateCourse = mutation({
  args: {
    id: v.id("courses"),
    name: v.string(),
    code: v.string(),
    creditUnit: v.number(),
    semester: v.string(),
    isGeneral: v.boolean(),
    programIds: v.array(v.id("program")),
    teacherIds: v.array(v.id("teachers")),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    await ctx.db.patch(id, rest);
    
    // Update all teachers to reflect course changes
    const allTeachers = await ctx.db.query("teachers").collect();
    for (const teacher of allTeachers) {
      let updatedCourseIds = teacher.courseIds;
      
      // Remove course from teachers no longer assigned
      if (teacher.courseIds.includes(id) && !args.teacherIds.includes(teacher._id)) {
        updatedCourseIds = updatedCourseIds.filter(courseId => courseId !== id);
      }
      
      // Add course to newly assigned teachers
      if (!teacher.courseIds.includes(id) && args.teacherIds.includes(teacher._id)) {
        updatedCourseIds = [...updatedCourseIds, id];
      }
      
      if (updatedCourseIds.length !== teacher.courseIds.length) {
        await ctx.db.patch(teacher._id, { courseIds: updatedCourseIds });
      }
    }
    
    return true;
  },
});

export const getCourses = query({
  handler: async (ctx) => {
    return await ctx.db.query("courses").collect();
  },
});

export const deleteCourse = mutation({
  args: { id: v.id("courses") },
  handler: async (ctx, args) => {
    // Remove course from all teachers
    const teachers = await ctx.db.query("teachers").collect();
    for (const teacher of teachers) {
      if (teacher.courseIds.includes(args.id)) {
        await ctx.db.patch(teacher._id, {
          courseIds: teacher.courseIds.filter(id => id !== args.id)
        });
      }
    }
    
    await ctx.db.delete(args.id);
    return true;
  },
});

export const getCoursesByProgram = query({
  args: { programId: v.id("program") },
  handler: async (ctx, args) => {
    const courses = await ctx.db
      .query("courses")
      .filter((q) => q.field("programIds").includes(args.programId))
      .collect();
    return courses;
  },
});

export const getCoursesByTeacher = query({
  args: { teacherId: v.id("teachers") },
  handler: async (ctx, args) => {
    const courses = await ctx.db
      .query("courses")
      .filter((q) => q.field("teacherIds").includes(args.teacherId))
      .collect();
    return courses;
  },
});