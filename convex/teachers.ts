import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const getTeachers = query({
  handler: async (ctx) => {
    return await ctx.db.query("teachers").collect();
  },
});

export const getTeacherById = query({
  args: { id: v.id("teachers") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getTeacherByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const teacher = await ctx.db
      .query("teachers")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();

    return teacher;
  },
});

export const addTeacher = mutation({
  args: {
    email: v.string(),
    firstname: v.string(),
    lastname: v.string(),
    phone: v.string(),
    address: v.string(),
    birthday: v.string(),
    sex: v.string(),
    img: v.string(), // Store image URL or base64
    teacherId: v.string(),
    courseIds: v.array(v.id("courses")),
    departmentId: v.id("departments"),
  },
  handler: async (ctx, args) => {
    const { firstname, lastname, ...rest } = args;
    const teacherId = await ctx.db.insert("teachers", {
      ...rest,
      name: `${firstname} ${lastname}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Update the assigned courses with the new teacher
    for (const courseId of args.courseIds) {
      const course = await ctx.db.get(courseId);
      if (course) {
        const teacherIds = course.teacherIds || [];
        if (!teacherIds.includes(teacherId)) {
          await ctx.db.patch(courseId, {
            teacherIds: [...teacherIds, teacherId],
          });
        }
      }
    }

    return teacherId;
  },
});

export const updateTeacher = mutation({
  args: {
    id: v.id("teachers"),
    email: v.string(),
    firstname: v.string(),
    lastname: v.string(),
    phone: v.string(),
    address: v.string(),
    birthday: v.string(),
    sex: v.string(),
    img: v.string(),
    courseIds: v.array(v.id("courses")),
    departmentId: v.id("departments"),
  },
  handler: async (ctx, args) => {
    const { id, courseIds, firstname, lastname, ...updates } = args;
    
    // Get the current teacher data
    const teacher = await ctx.db.get(id);
    if (!teacher) {
      throw new Error("Teacher not found");
    }

    // Get the old course assignments
    const oldCourseIds = teacher.courseIds || [];

    // Update the teacher's basic information
    await ctx.db.patch(id, {
      ...updates,
      name: `${firstname} ${lastname}`,
      updatedAt: new Date().toISOString(),
      courseIds,
    });

    // Remove teacher from unassigned courses
    for (const courseId of oldCourseIds) {
      if (!courseIds.includes(courseId)) {
        const course = await ctx.db.get(courseId);
        if (course) {
          const teacherIds = course.teacherIds || [];
          await ctx.db.patch(courseId, {
            teacherIds: teacherIds.filter((tid: Id<"teachers">) => tid !== id),
          });
        }
      }
    }

    // Add teacher to newly assigned courses
    for (const courseId of courseIds) {
      if (!oldCourseIds.includes(courseId)) {
        const course = await ctx.db.get(courseId);
        if (course) {
          const teacherIds = course.teacherIds || [];
          if (!teacherIds.includes(id)) {
            await ctx.db.patch(courseId, {
              teacherIds: [...teacherIds, id],
            });
          }
        }
      }
    }

    return id;
  },
});

export const deleteTeacher = mutation({
  args: { id: v.id("teachers") },
  handler: async (ctx, args) => {
    const teacher = await ctx.db.get(args.id);
    if (!teacher) {
      throw new Error("Teacher not found");
    }

    // Remove teacher from all assigned courses
    const courseIds = teacher.courseIds || [];
    for (const courseId of courseIds) {
      const course = await ctx.db.get(courseId);
      if (course) {
        const teacherIds = course.teacherIds || [];
        await ctx.db.patch(courseId, {
          teacherIds: teacherIds.filter((tid: Id<"teachers">) => tid !== args.id),
        });
      }
    }

    // Delete the teacher
    await ctx.db.delete(args.id);
    return true;
  },
});

export const getCurrentTeacher = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const email = identity.email;
    if (!email) {
      return null;
    }

    const teacher = await ctx.db
      .query("teachers")
      .filter((q) => q.eq(q.field("email"), email))
      .first();

    return teacher;
  },
}); 