import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireUser, requireUserAndLimit } from "./_helpers";

export const list = query({
  args: {},
  handler: async (ctx) => {
    await requireUser(ctx);
    const all = await ctx.db.query("ticks").collect();
    return all.map((t) => t.key);
  },
});

export const set = mutation({
  args: { key: v.string(), done: v.boolean() },
  handler: async (ctx, { key, done }) => {
    await requireUserAndLimit(ctx, "write");
    if (key.length > 64) throw new Error("Key too long");
    const existing = await ctx.db
      .query("ticks")
      .withIndex("by_key", (q) => q.eq("key", key))
      .first();
    if (done && !existing) {
      await ctx.db.insert("ticks", { key });
    } else if (!done && existing) {
      await ctx.db.delete(existing._id);
    }
    return done;
  },
});

export const reset = mutation({
  args: {},
  handler: async (ctx) => {
    await requireUserAndLimit(ctx, "destructive");
    const all = await ctx.db.query("ticks").collect();
    await Promise.all(all.map((t) => ctx.db.delete(t._id)));
  },
});
