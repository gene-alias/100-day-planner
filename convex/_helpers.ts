import { QueryCtx, MutationCtx } from "./_generated/server";

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
