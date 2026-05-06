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

function boundedArr(arr: string[] | undefined, maxItems: number, maxLen: number, label: string) {
  if (!arr) return;
  if (arr.length > maxItems) {
    throw new ConvexError({
      code: "TOO_MANY",
      message: `${label}: too many items (max ${maxItems}, got ${arr.length})`,
    });
  }
  arr.forEach((s, i) => bounded(s, maxLen, `${label}[${i}]`));
}

export const list = query({
  args: {},
  handler: async (ctx) => {
    await requireUser(ctx);
    return await ctx.db.query("dayOverrides").collect();
  },
});

export const upsert = mutation({
  args: {
    day: v.number(),
    focus: v.optional(v.string()),
    tasks: v.optional(v.array(v.string())),
    deliverable: v.optional(v.string()),
    mktFocus: v.optional(v.string()),
    mktTasks: v.optional(v.array(v.string())),
    mktDeliverable: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireUserAndLimit(ctx, "write");
    if (args.day < 1 || args.day > 100) {
      throw new ConvexError({ code: "BAD_DAY", message: "Day out of range (1-100)" });
    }
    bounded(args.focus, 200, "Focus");
    bounded(args.deliverable, 500, "Deliverable");
    bounded(args.mktFocus, 200, "Mkt focus");
    bounded(args.mktDeliverable, 500, "Mkt deliverable");
    boundedArr(args.tasks, 50, 1000, "Tasks");
    boundedArr(args.mktTasks, 50, 1000, "Mkt tasks");

    const existing = await ctx.db
      .query("dayOverrides")
      .withIndex("by_day", (q) => q.eq("day", args.day))
      .first();
    const data = { ...args, updatedAt: Date.now() };
    if (existing) {
      await ctx.db.patch(existing._id, data);
      return existing._id;
    }
    return await ctx.db.insert("dayOverrides", data);
  },
});

export const reset = mutation({
  args: { day: v.number() },
  handler: async (ctx, { day }) => {
    await requireUserAndLimit(ctx, "destructive");
    const existing = await ctx.db
      .query("dayOverrides")
      .withIndex("by_day", (q) => q.eq("day", day))
      .first();
    if (existing) await ctx.db.delete(existing._id);
  },
});
