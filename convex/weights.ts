import { query, mutation } from "./_generated/server";
import { v, ConvexError } from "convex/values";
import { requireUser, requireUserAndLimit } from "./_helpers";

export const list = query({
  args: {},
  handler: async (ctx) => {
    await requireUser(ctx);
    return await ctx.db
      .query("weightLogs")
      .withIndex("by_logged_at")
      .order("desc")
      .take(365);
  },
});

export const log = mutation({
  args: {
    weight: v.number(),
    note: v.optional(v.string()),
  },
  handler: async (ctx, { weight, note }) => {
    await requireUserAndLimit(ctx, "write");
    if (weight < 30 || weight > 300) {
      throw new ConvexError({
        code: "BAD_WEIGHT",
        message: "Weight must be 30–300 kg",
      });
    }
    if (note !== undefined && note.length > 500) {
      throw new ConvexError({
        code: "TOO_LONG",
        message: "Note too long (max 500 chars)",
      });
    }
    return await ctx.db.insert("weightLogs", {
      weight,
      loggedAt: Date.now(),
      note,
    });
  },
});

export const remove = mutation({
  args: { id: v.id("weightLogs") },
  handler: async (ctx, { id }) => {
    await requireUserAndLimit(ctx, "destructive");
    const row = await ctx.db.get(id);
    if (row) await ctx.db.delete(id);
  },
});
