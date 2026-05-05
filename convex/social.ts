import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("social").collect();
  },
});

export const upsert = mutation({
  args: {
    day: v.number(),
    concept: v.optional(v.string()),
    hook: v.optional(v.string()),
    script: v.optional(v.string()),
    shotList: v.optional(v.string()),
    caption: v.optional(v.string()),
    hashtags: v.optional(v.string()),
    platforms: v.optional(v.array(v.string())),
    format: v.optional(v.string()),
    status: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("social")
      .withIndex("by_day", (q) => q.eq("day", args.day))
      .first();
    const data = { ...args, updatedAt: Date.now() };
    if (existing) {
      await ctx.db.patch(existing._id, data);
      return existing._id;
    }
    return await ctx.db.insert("social", data);
  },
});

export const remove = mutation({
  args: { day: v.number() },
  handler: async (ctx, { day }) => {
    const existing = await ctx.db
      .query("social")
      .withIndex("by_day", (q) => q.eq("day", day))
      .first();
    if (existing) await ctx.db.delete(existing._id);
  },
});
