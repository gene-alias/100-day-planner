import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  ticks: defineTable({
    key: v.string(),
  }).index("by_key", ["key"]),

  files: defineTable({
    category: v.string(),
    name: v.string(),
    mimeType: v.string(),
    size: v.number(),
    storageId: v.id("_storage"),
    uploadedAt: v.number(),
  }).index("by_category", ["category"]),

  social: defineTable({
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
    updatedAt: v.number(),
  }).index("by_day", ["day"]),
});
