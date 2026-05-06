import { QueryCtx, MutationCtx } from "./_generated/server";
import { ConvexError } from "convex/values";
import { RateLimiter, MINUTE } from "@convex-dev/rate-limiter";
import { components } from "./_generated/api";

const ALLOWED_EMAILS = new Set<string>([
  "gene@alias.com.ai",
  "dan@alias.com.ai",
  "brad@alias.com.ai",
  "mark@alias.com.ai",
]);

export async function requireUser(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new ConvexError({
      code: "AUTH_MISSING",
      message: "Not signed in",
    });
  }
  const rawEmail = identity.email;
  const email = rawEmail?.toLowerCase();
  if (!email) {
    throw new ConvexError({
      code: "AUTH_NO_EMAIL",
      message: "Google ID token has no email claim",
    });
  }
  if (!ALLOWED_EMAILS.has(email)) {
    throw new ConvexError({
      code: "AUTH_FORBIDDEN",
      message: `Email "${email}" is not on the allowlist`,
    });
  }
  return identity;
}

export const rateLimiter = new RateLimiter(components.rateLimiter, {
  write: { kind: "token bucket", rate: 120, period: MINUTE, capacity: 120 },
  upload: { kind: "token bucket", rate: 30, period: MINUTE, capacity: 30 },
  destructive: { kind: "token bucket", rate: 30, period: MINUTE, capacity: 30 },
});

export async function requireUserAndLimit(
  ctx: MutationCtx,
  bucket: "write" | "upload" | "destructive",
) {
  const identity = await requireUser(ctx);
  const key = identity.email?.toLowerCase() ?? "anonymous";
  const result = await rateLimiter.limit(ctx, bucket, { key });
  if (!result.ok) {
    const retrySecs = Math.ceil((result.retryAfter ?? 0) / 1000);
    throw new ConvexError({
      code: "RATE_LIMITED",
      message: `Rate limit hit on "${bucket}" bucket. Retry in ${retrySecs}s.`,
    });
  }
  return identity;
}
