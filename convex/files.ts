import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireUser } from "./_helpers";

const MAX_FILE_BYTES = 100 * 1024 * 1024; // 100MB
const ALLOWED_MIME = /^(image\/|video\/|audio\/|application\/pdf|application\/zip|application\/x-zip-compressed|text\/|application\/json|application\/octet-stream)/;

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requireUser(ctx);
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
    await requireUser(ctx);
    if (args.name.length === 0 || args.name.length > 255) {
      throw new Error("Filename invalid (1–255 chars)");
    }
    if (args.category.length === 0 || args.category.length > 64) {
      throw new Error("Category invalid");
    }
    if (args.size < 0 || args.size > MAX_FILE_BYTES) {
      throw new Error(`File too large (max ${MAX_FILE_BYTES} bytes)`);
    }
    if (!ALLOWED_MIME.test(args.mimeType)) {
      throw new Error("File type not allowed");
    }
    return await ctx.db.insert("files", {
      ...args,
      uploadedAt: Date.now(),
    });
  },
});

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    await requireUser(ctx);
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
    await requireUser(ctx);
    const file = await ctx.db.get(id);
    if (!file) return;
    await ctx.storage.delete(file.storageId);
    await ctx.db.delete(id);
  },
});
