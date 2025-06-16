import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.optional(v.string()),
    email: v.string(),
    imageUrl: v.optional(v.string()),
    clerkUserId: v.string(),
    role: v.union(
      v.literal("student"),
      v.literal("teacher"),
      v.literal("admin")
    ),
  }).index("byClerkUserId", ["clerkUserId"]),
  students: defineTable({
    // Personal Information
    firstName: v.string(),
    lastName: v.string(),
    middleName: v.string(),
    userId: v.id("users"),
    dob: v.string(),
    gender: v.string(),
    email: v.string(),
    phone: v.string(),
    address: v.string(),
    city: v.string(),
    departmentId: v.id("departments"),
    programId: v.id("program"),
    programName: v.optional(v.string()),
    imageUrl:v.string(),
    state: v.string(),
    zipCode: v.string(),
    lga: v.string(),
    religion: v.string(),
    level: v.optional(
      v.union(v.literal("level1"), v.literal("level2"), v.literal("graduate"))
    ),
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

    // Program Selection
    program: v.string(),
    concentration: v.string(),
    startTerm: v.string(),

    // Health Information
    allergies: v.string(),
    medications: v.string(),
    conditions: v.string(),
    emergencyContact: v.string(),
    emergencyPhone: v.string(),
    applicationNumber: v.string(), // Add appvlication number

    // File Storage IDs
    secondarySchoolResultStorageId: v.union(v.id("_storage"), v.null()),
    birthCertificateStorageId: v.union(v.id("_storage"), v.null()),
    nationalIdStorageId: v.union(v.id("_storage"), v.null()),
    primaryCertificateStorageId: v.union(v.id("_storage"), v.null()),
    transcriptStorageId: v.union(v.id("_storage"), v.null()),
    personalStatementStorageId: v.union(v.id("_storage"), v.null()),
    generatedPdfStorageId: v.id("_storage"),
    profileImageStorageId: v.union(v.id("_storage"), v.null()), // Added profile image storage
    
    recommendationLetters: v.number(),
    agreeTerms: v.boolean(),
    status: v.union(
      v.literal("admitted"),
      v.literal("progress"),
      v.literal("rejected")
    ),
    applicationDate: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_status", ["status"])
    .index("by_userId", ["userId"])
    .index("by_department", ["departmentId"]),
  files: defineTable({
    storageId: v.id("_storage"),
    fileName: v.string(),
    fileType: v.string(),
    uploadedAt: v.number(),
  }),
  screeningSlots: defineTable({
    date: v.string(), // ISO date string
    startTime: v.string(), // "HH:MM" format
    maxCapacity: v.number(),
    bookings: v.number(),
  })
    .index("by_date", ["date"])
    .index("by_bookings", ["bookings"]),

  applications: defineTable({
    name: v.string(),
    email: v.string(),
    slotId: v.id("screeningSlots"),
  }).index("by_slotId", ["slotId"]),
  departments: defineTable({
    name: v.string(),
    level1Count: v.number(),
    level2Count: v.number(),
    totalGraduates: v.number(),
  }).index("by_name", ["name"]),
  program: defineTable({
    departmentId: v.id("departments"), 
    name: v.string(),
    level1Count: v.number(), 
    level2Count: v.number(), 
    graduateCount: v.number(), 
  }).index("by_departmentId", ["departmentId"]),
   courses: defineTable({
    name: v.string(),
    code: v.string(),
    creditUnit: v.number(),
    semester: v.string(),
    isGeneral: v.boolean(),
    programIds: v.array(v.id("program")),
    teacherIds: v.array(v.id("teachers")),
  }),
  
  teachers: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    address: v.string(),
    birthday: v.string(),
    sex: v.string(),
    img: v.string(),
    teacherId: v.string(),
    departmentId: v.id("departments"),
    courseIds: v.array(v.id("courses")),
    createdAt: v.string(),
    updatedAt: v.string(),
  }),
  timetables: defineTable({
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
  }).index("by_department_program", ["departmentId", "programId"]),

  examTimetable: defineTable({
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
    createdAt: v.string(),
  }).index("by_program_semester", ["programId", "semester"]),

  levels: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
  }),

  announcements: defineTable({
    title: v.string(),
    content: v.string(),
    targetRoles: v.array(v.string()), // ["student", "teacher", "both"]
    createdBy: v.id("users"),
    createdAt: v.number(),
  }),

  events: defineTable({
    title: v.string(),
    description: v.string(),
    startTime: v.string(),
    endTime: v.string(),
    date: v.string(),
    createdBy: v.id("users"),
    createdAt: v.number(),
  }),
});
