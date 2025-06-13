import { v } from "convex/values";
import { mutation, query } from "./_generated/server";


export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});


export const saveStorageId = mutation({
  args: { 
    storageId: v.id("_storage"),
    fileName: v.optional(v.string()),  // Add fileName
    fileType: v.optional(v.string()),  // Add fileType
  },
  handler: async (ctx, { storageId, fileName, fileType }) => {
    await ctx.db.insert("files", { 
      storageId,
      fileName: fileName || "unknown",
      fileType: fileType || "application/octet-stream",
      uploadedAt: Date.now()
    });
  },
});

export const getFileUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, { storageId }) => {
    return await ctx.storage.getUrl(storageId);
  },
});