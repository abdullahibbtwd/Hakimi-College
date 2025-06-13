// // convex/departments.ts
// import { mutation, query } from "./_generated/server";
// import { v } from "convex/values";

// // Fixed getDepartments query
// export const getDepartments = query(async ({ db }) => {
//   return await db.query("departments").collect();
// });

// // Fixed mutations
// export const addDepartment = mutation({
//   args: { name: v.string() },
//   handler: async ({ db }, { name }) => {
//     return await db.insert("departments", {
//       name,
//       level1Count: 0,
//       level2Count: 0,
//       totalGraduates: 0,
//     });
//   },
// });

// export const editDepartment = mutation({
//   args: {
//     departmentId: v.id("departments"),
//     newName: v.string(),
//   },
//   handler: async ({ db }, { departmentId, newName }) => {
//     return await db.patch(departmentId, { name: newName });
//   },
// });

// export const deleteDepartment = mutation({
//   args: { departmentId: v.id("departments") },
//   handler: async ({ db }, { departmentId }) => {
//     return await db.delete(departmentId);
//   },
// });

// // Added this new mutation for bulk promotion
// export const promoteAllToLevel2 = mutation({
//   args: { departmentId: v.id("departments") },
//   handler: async ({ db }, { departmentId }) => {
//     const department = await db.get(departmentId);
//     if (!department) throw new Error("Department not found");
    
//     await db.patch(departmentId, {
//       level1Count: 0,
//       level2Count: (department.level2Count || 0) + (department.level1Count || 0)
//     });
    
//     return true;
//   },
// });
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";


export const getDepartments = query(async ({ db }) => {
  const departments = await db.query("departments").collect();


  const departmentsWithAggregatedCounts = await Promise.all(
    departments.map(async (department) => {
      const program = await db
        .query("program")
        .withIndex("by_departmentId", (q) => q.eq("departmentId", department._id))
        .collect();

      const aggregatedLevel1 = program.reduce((sum, course) => sum + course.level1Count, 0);
      const aggregatedLevel2 = program.reduce((sum, course) => sum + course.level2Count, 0);
      const aggregatedGraduates = program.reduce((sum, course) => sum + course.graduateCount, 0);

      // await db.patch(department._id, {
      //   level1Count: aggregatedLevel1,
      //   level2Count: aggregatedLevel2,
      //   totalGraduates: aggregatedGraduates,
      // });

      return {
        ...department,
        level1Count: aggregatedLevel1,
        level2Count: aggregatedLevel2,
        totalGraduates: aggregatedGraduates,
    
        total: aggregatedLevel1 + aggregatedLevel2 + aggregatedGraduates,
      };
    })
  );

  return departmentsWithAggregatedCounts;
});

export const addDepartment = mutation({
  args: { name: v.string() },
  handler: async ({ db }, { name }) => {
    return await db.insert("departments", {
      name,
      level1Count: 0,
      level2Count: 0, 
      totalGraduates: 0, 
    });
  },
});

export const editDepartment = mutation({
  args: {
    departmentId: v.id("departments"),
    newName: v.string(),
  },
  handler: async ({ db }, { departmentId, newName }) => {
    return await db.patch(departmentId, { name: newName });
  },
});

export const deleteDepartment = mutation({
  args: { departmentId: v.id("departments") },
  handler: async ({ db }, { departmentId }) => {
 
    const programToDelete = await db
      .query("program")
      .withIndex("by_departmentId", (q) => q.eq("departmentId", departmentId))
      .collect();

    for (const program of programToDelete) {
      await db.delete(program._id);
    }


    return await db.delete(departmentId);
  },
});

export const promoteAllToLevel2 = mutation({
  args: { departmentId: v.id("departments") },
  handler: async ({ db }, { departmentId }) => {
    const programInDepartment = await db
      .query("program")
      .withIndex("by_departmentId", (q) => q.eq("departmentId", departmentId))
      .collect();

 
    for (const program of programInDepartment) {
      if (program.level1Count > 0) {
        await db.patch(program._id, {
          level2Count: program.level2Count + program.level1Count,
          level1Count: 0,
        });
      }
    }

    return true;
  },
});

export const promoteProgramLevel2ToGraduates = mutation({
  args: { programId: v.id("program") }, 
  handler: async ({ db }, { programId }) => {
    const program = await db.get(programId);
    if (!program) throw new Error("Program not found");

    if (program.level2Count > 0) {
      await db.patch(program._id, {
        graduateCount: program.graduateCount + program.level2Count,
        level2Count: 0,
      });
    }
    return true;
  },
});

export const getDepartmentById = query({
  args: { departmentId: v.id("departments") },
  handler: async (ctx, args) => {
    const department = await ctx.db.get(args.departmentId);
    return department;
  },
});