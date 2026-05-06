import { query, mutation } from "./_generated/server";
import { v, ConvexError } from "convex/values";
import { requireUser, requireUserAndLimit } from "./_helpers";

function bounded(s: string | undefined, max: number, label: string) {
  if (s !== undefined && s.length > max) {
    throw new ConvexError({
      code: "TOO_LONG",
      message: `${label} too long (max ${max} chars, got ${s.length})`,
    });
  }
}

export const list = query({
  args: {},
  handler: async (ctx) => {
    await requireUser(ctx);
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
    await requireUserAndLimit(ctx, "write");
    if (args.day < 1 || args.day > 100) {
      throw new ConvexError({ code: "BAD_DAY", message: "Day out of range (1-100)" });
    }
    bounded(args.concept, 500, "Concept");
    bounded(args.hook, 500, "Hook");
    bounded(args.script, 20000, "Script");
    bounded(args.shotList, 20000, "Shot list");
    bounded(args.caption, 5000, "Caption");
    bounded(args.hashtags, 1000, "Hashtags");
    bounded(args.format, 64, "Format");
    bounded(args.status, 32, "Status");
    bounded(args.notes, 20000, "Notes");
    if (args.platforms && args.platforms.length > 32) {
      throw new ConvexError({ code: "TOO_MANY", message: "Too many platforms (max 32)" });
    }
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
    await requireUserAndLimit(ctx, "destructive");
    const existing = await ctx.db
      .query("social")
      .withIndex("by_day", (q) => q.eq("day", day))
      .first();
    if (existing) await ctx.db.delete(existing._id);
  },
});
