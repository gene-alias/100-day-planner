import { QueryCtx, MutationCtx } from "./_generated/server";
import { RateLimiter, MINUTE } from "@convex-dev/rate-limiter";
import { components } from "./_generated/api";

const ALLOWED_EMAILS = new Set<string>([
  "gene@alias.com.ai",
  // add more collaborators here
]);

export async function requireUser(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Unauthenticated");
  }
  const email = identity.email?.toLowerCase();
  if (!email || !ALLOWED_EMAILS.has(email)) {
    throw new Error("Forbidden");
  }
  return identity;
}

// Per-user token-bucket rate limits.
// `rate` = tokens added per `period`; `capacity` = max burst.
// All limits are per identified user (keyed by email).
export const rateLimiter = new RateLimiter(components.rateLimiter, {
  // Normal mutations (ticks:set, social:upsert, files:saveFile)
  write: { kind: "token bucket", rate: 120, period: MINUTE, capacity: 120 },
  // File upload kickoff — caps storage abuse
  upload: { kind: "token bucket", rate: 30, period: MINUTE, capacity: 30 },
  // Destructive ops (ticks:reset, files:deleteFile, social:remove)
  destructive: { kind: "token bucket", rate: 30, period: MINUTE, capacity: 30 },
});

export async function requireUserAndLimit(
  ctx: MutationCtx,
  bucket: "write" | "upload" | "destructive",
) {
  const identity = await requireUser(ctx);
  const key = identity.email?.toLowerCase() ?? "anonymous";
  await rateLimiter.limit(ctx, bucket, { key, throws: true });
  return identity;
}
