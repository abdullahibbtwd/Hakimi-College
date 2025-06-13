import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Get all results (for admin)
export const getAllResults = query({
  handler: async (ctx) => {
    const results = await ctx.db.query("results").collect();
    return results;
  },
});

// Get results for a specific teacher's courses
export const getTeacherResults = query({
  args: { teacherId: v.id("teachers") },
  handler: async (ctx, args) => {
    const results = await ctx.db
      .query("results")
      .filter((q) => q.eq(q.field("teacherId"), args.teacherId))
      .collect();
    return results;
  },
});

// Get results for a specific student
export const getStudentResults = query({
  args: {
    studentId: v.id("students"),
    semester: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const results = await ctx.db
      .query("results")
      .filter((q) => q.eq(q.field("studentId"), args.studentId))
      .filter((q) => args.semester ? q.eq(q.field("semester"), args.semester) : q.gt(q.field("_id"), ""))
      .collect();

    // Get course details for each result
    const resultsWithDetails = await Promise.all(
      results.map(async (result) => {
        const course = await ctx.db.get(result.courseId);
        return {
          _id: result._id,
          courseId: result.courseId,
          studentId: result.studentId,
          semester: result.semester,
          caMark: result.caMark,
          examMark: result.examMark,
          totalMark: result.totalMark,
          grade: result.grade,
          gradePoint: result.gradePoint,
          courseCode: course?.code,
          courseName: course?.name,
          creditUnit: course?.creditUnit,
        };
      })
    );

    return resultsWithDetails;
  },
});

// Add or update a result
export const addOrUpdateResult = mutation({
  args: {
    studentId: v.id("students"),
    courseId: v.id("courses"),
    teacherId: v.id("teachers"),
    caMark: v.number(),
    examMark: v.number(),
    semester: v.string(),
  },
  handler: async (ctx, args) => {
    const { studentId, courseId, teacherId, caMark, examMark, semester } = args;
    
    // Calculate total mark and grade
    const totalMark = caMark + examMark;
    let grade = "F";
    let gradePoint = 0;
    
    if (totalMark >= 70) {
      grade = "A";
      gradePoint = 5;
    } else if (totalMark >= 60) {
      grade = "B";
      gradePoint = 4;
    } else if (totalMark >= 55) {
      grade = "C";
      gradePoint = 3;
    } else if (totalMark >= 45) {
      grade = "D";
      gradePoint = 2;
    } else if (totalMark >= 40) {
      grade = "E";
      gradePoint = 1;
    }

    // Get course credit unit
    const course = await ctx.db.get(courseId);
    const creditUnit = course?.creditUnit || 0;
    
    // Calculate grade point
    const calculatedGradePoint = gradePoint * creditUnit;

    // Check if result already exists
    const existingResult = await ctx.db
      .query("results")
      .filter((q) => 
        q.and(
          q.eq(q.field("studentId"), studentId),
          q.eq(q.field("courseId"), courseId),
          q.eq(q.field("semester"), semester)
        )
      )
      .unique();

    if (existingResult) {
      // Update existing result
      await ctx.db.patch(existingResult._id, {
        caMark,
        examMark,
        totalMark,
        grade,
        gradePoint: calculatedGradePoint,
        updatedAt: new Date().toISOString(),
      });
      return existingResult._id;
    } else {
      // Create new result
      const resultId = await ctx.db.insert("results", {
        studentId,
        courseId,
        teacherId,
        caMark,
        examMark,
        totalMark,
        grade,
        gradePoint: calculatedGradePoint,
        semester,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      return resultId;
    }
  },
});

// Calculate student's CGPA
export const calculateStudentCGPA = query({
  args: { 
    studentId: v.id("students"),
    semester: v.string()
  },
  handler: async (ctx, args) => {
    const results = await ctx.db
      .query("results")
      .filter((q) => 
        q.and(
          q.eq(q.field("studentId"), args.studentId),
          q.eq(q.field("semester"), args.semester)
        )
      )
      .collect();

    let totalGradePoints = 0;
    let totalCreditUnits = 0;

    for (const result of results) {
      const course = await ctx.db.get(result.courseId);
      if (course) {
        totalGradePoints += result.gradePoint;
        totalCreditUnits += course.creditUnit;
      }
    }

    const cgpa = totalCreditUnits > 0 ? totalGradePoints / totalCreditUnits : 0;
    return {
      cgpa: parseFloat(cgpa.toFixed(2)),
      totalGradePoints,
      totalCreditUnits,
    };
  },
}); 