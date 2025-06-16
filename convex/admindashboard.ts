
import {  query } from "./_generated/server";

export const getStudentStats = query({
  handler: async (ctx) => {
    const students = await ctx.db.query("students").collect();
    
    const admittedStudents = students.filter(
      student => student.status?.toLowerCase() === "admitted"
    );

    return {
      total: admittedStudents.length,
      male: admittedStudents.filter(s => s.gender?.toLowerCase() === 'male').length,
      female: admittedStudents.filter(s => s.gender?.toLowerCase() === 'female').length
    };
  }
});
export const getTeacherStats = query({
  handler: async (ctx) => {
    const teachers = await ctx.db.query("teachers").collect();
    return { total: teachers.length };
  }
});