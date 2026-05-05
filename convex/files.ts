import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const saveFile = mutation({
  args: {
    category: v.string(),
    name: v.string(),
    mimeType: v.string(),
    size: v.number(),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("files", {
      ...args,
      uploadedAt: Date.now(),
    });
  },
});

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("files").order("desc").collect();
    return await Promise.all(
      all.map(async (f) => ({
        _id: f._id,
        category: f.category,
        name: f.name,
        mimeType: f.mimeType,
        size: f.size,
        uploadedAt: f.uploadedAt,
        url: await ctx.storage.getUrl(f.storageId),
      }))
    );
  },
});

export const deleteFile = mutation({
  args: { id: v.id("files") },
  handler: async (ctx, { id }) => {
    const file = await ctx.db.get(id);
    if (!file) return;
    await ctx.storage.delete(file.storageId);
    await ctx.db.delete(id);
  },
});
