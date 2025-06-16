import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
type ProgramDocument = {
  _id: Id<"program">;
  _creationTime: number;
  name: string;
  departmentId: Id<"departments">;
  level1Count: number;
  level2Count: number;
  graduateCount: number;
};
export const submitApplication = mutation({
  args: {
    formData: v.object({
      // Personal Information
      firstName: v.string(),
      lastName: v.string(),
      middleName: v.string(),
      dob: v.string(),
      gender: v.string(),
      email: v.string(),
      phone: v.string(),
      address: v.string(),
      city: v.string(),
      state: v.string(),
      departmentId: v.id("departments"),
      programId: v.id("program"),
      zipCode: v.string(),
      lga: v.string(),
      religion: v.string(),
      applicationNumber:v.string(),
      // Academic Information
      highSchool: v.string(),
      graduationYear: v.string(),
      gpa: v.string(),
      satScore: v.string(),
      actScore: v.string(),
      previousCollege: v.boolean(),
      collegeCourses: v.string(),
      studentName: v.string(),
      secondarySchool: v.string(),
      examType: v.string(),
      examYear: v.string(),
      subject1Name: v.string(),
      subject1Grade: v.string(),
      subject2Name: v.string(),
      subject2Grade: v.string(),
      subject3Name: v.string(),
      subject3Grade: v.string(),
      subject4Name: v.string(),
      subject4Grade: v.string(),
      subject5Name: v.string(),
      subject5Grade: v.string(),
      subject6Name: v.string(),
      subject6Grade: v.string(),
      subject7Name: v.string(),
      subject7Grade: v.string(),
      subject8Name: v.string(),
      subject8Grade: v.string(),
      subject9Name: v.string(),
      subject9Grade: v.string(),
      programName: v.string(),
      // Program Selection
      program: v.string(),
      concentration: v.string(),
      startTerm: v.string(),
      imageUrl:v.string(),

      // Health Information
      allergies: v.string(),
      medications: v.string(),
      conditions: v.string(),
      emergencyContact: v.string(),
      emergencyPhone: v.string(),

      // Other
      recommendationLetters: v.number(),
      agreeTerms: v.boolean(),
    }),
    files: v.object({
      secondarySchoolResult: v.optional(v.id("_storage")),
      birthCertificate: v.optional(v.id("_storage")),
      nationalId: v.optional(v.id("_storage")),
      primaryCertificate: v.optional(v.id("_storage")),
      transcript: v.optional(v.id("_storage")),
      personalStatement: v.optional(v.id("_storage")),
      generatedPdf: v.id("_storage"),
      profileImage: v.optional(v.id("_storage")), 
    })
  },
  handler: async (ctx, args) => {
    const applicationDate = Date.now();
       const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("byClerkUserId", q => q.eq("clerkUserId", identity.subject))
      .unique();

    if (!user) throw new Error("User not found");
   const studentId = await ctx.db.insert("students", {
      ...args.formData,
       userId: user._id,
      secondarySchoolResultStorageId: args.files.secondarySchoolResult || null,
      birthCertificateStorageId: args.files.birthCertificate || null,
      nationalIdStorageId: args.files.nationalId || null,
      primaryCertificateStorageId: args.files.primaryCertificate || null,
      transcriptStorageId: args.files.transcript || null,
      personalStatementStorageId: args.files.personalStatement || null,
      generatedPdfStorageId: args.files.generatedPdf,
       profileImageStorageId: args.files.profileImage || null, 
      status: "progress",
      applicationDate
    });
    
   return { 
      success: true,
      studentId
    };
  },
});
export const getApplicants = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("students")
      .filter(q => q.eq(q.field("status"), "progress"))
      .collect();
  },
});

export const updateStatus = mutation({
  args: {
    studentId: v.id("students"),
    status: v.union(
      v.literal("admitted"),
      v.literal("progress"),
      v.literal("rejected")
    )
  },
  handler: async (ctx, args) => {
    const student = await ctx.db.get(args.studentId);
    if (!student) throw new Error("Student not found");

    const oldStatus = student.status;
    await ctx.db.patch(args.studentId, { status: args.status });

    // Handle course/department enrollment only for new admissions
    if (oldStatus !== "admitted" && args.status === "admitted") {
      if (!student.departmentId || !student.programName) {
        throw new Error("Student is missing department or program information");
      }

      // Find the course by departmentId and program name
      const programs = await ctx.db
        .query("program")
        .withIndex("by_departmentId", q => q.eq("departmentId", student.departmentId))
        .collect();

      const program = programs.find(c => c.name === student.programName);
      
      if (!program) {
        throw new Error(`Program not found: ${student.programName} in department ${student.departmentId}`);
      }

      // Update course count
      await ctx.db.patch(program._id, {
        level1Count: (program.level1Count || 0) + 1
      });

      // Update student with level and course info
      await ctx.db.patch(args.studentId, {
        level: "level1",
        programId: program._id
      });
    }
    
    // Handle reverting admission
    if (oldStatus === "admitted" && args.status !== "admitted") {
      if (student.programId) {
        const program = await ctx.db.get(student.programId);
        if (program) {
          await ctx.db.patch(program._id, {
            level1Count: Math.max(0, (program.level1Count || 0) - 1)
          });
        }
      }
    }
  }
});
export const updateStorageEntry = mutation({
  args: {
    studentId: v.id("students"),
    files: v.object({
      generatedPdf: v.id("_storage"),
    })
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.studentId, {
      generatedPdfStorageId: args.files.generatedPdf,
    });
  }
});
export const getCurrentStudent = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    // Get user
    const user = await ctx.db
      .query("users")
      .withIndex("byClerkUserId", q => q.eq("clerkUserId", identity.subject))
      .unique();

    if (!user || user.role !== "student") return null;

    // Get student record
    const student = await ctx.db
      .query("students")
      .withIndex("by_userId", q => q.eq("userId", user._id))
      .unique();

    if (!student) return null;


    let pdfUrl = null;
    if (student.generatedPdfStorageId) {
      pdfUrl = await ctx.storage.getUrl(student.generatedPdfStorageId);
    }

    return {
      ...student,
      pdfUrl, 
    };
  },
});
// convex/students.ts
export const getAdmittedStudentsWithDetails = query({
  handler: async (ctx) => {
    const students = await ctx.db
      .query("students")
      .withIndex("by_status", q => q.eq("status", "admitted"))
      .collect();

    return Promise.all(students.map(async (student) => {
      let departmentName = "";
      let programName = "";
      
      if (student.departmentId) {
        const dept = await ctx.db.get(student.departmentId);
        departmentName = dept?.name || "";
      }
      
      if (student.programId) {
        const program = await ctx.db.get(student.programId);
        programName = program?.name || "";
      }
      
      return {
        ...student,
        departmentName,
        programName
      };
    }));
  },
});

export const updateStudentAssignment = mutation({
  args: {
    studentId: v.id("students"),
    departmentId: v.optional(v.id("departments")),
    programId: v.optional(v.id("program")),
    level: v.optional(v.union(
      v.literal("level1"),
      v.literal("level2"),
      v.literal("graduate")
    ))
  },
  handler: async (ctx, args) => {
    const { studentId, departmentId, programId, level } = args;
    const student = await ctx.db.get(studentId);
    if (!student) throw new Error("Student not found");

    const oldProgramId = student.programId;
    const oldDepartmentId = student.departmentId;
    const oldLevel = student.level;


    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updates: any = {};
    if (departmentId !== undefined) updates.departmentId = departmentId;
    if (programId !== undefined) updates.programId = programId;
    if (level !== undefined) updates.level = level;

    const newProgramId = programId ?? oldProgramId;
    const newLevel = level ?? oldLevel;
    //const newDepartmentId = departmentId ?? oldDepartmentId;

    // 1. Remove student from old course/department counts
    if (oldProgramId && oldLevel) {
      const oldProgram = await ctx.db.get(oldProgramId);
      if (oldProgram) {
        const countField = `${oldLevel}Count`;
        await ctx.db.patch(oldProgramId, {
          [countField]: Math.max(0, (oldProgram[countField] || 0) - 1)
        });
      }
    }

    
    await ctx.db.patch(studentId, updates);

 
  if (newProgramId && newLevel) {
  const newProgram = await ctx.db.get(newProgramId);
  if (newProgram) {
    const program = newProgram as ProgramDocument;
    const countField = `${newLevel}Count` as keyof ProgramDocument;
    
    await ctx.db.patch(newProgramId, {
      [countField]: program[countField] + 1 // No need for || 0 since we know it's a number
    });
  }
}
    return true;
  },
});

export const getStudentByUserId = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const student = await ctx.db
      .query("students")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    return student;
  },
});