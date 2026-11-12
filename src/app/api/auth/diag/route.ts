import { NextResponse } from "next/server";
import { ADMIN_EMAIL, ADMIN_PASSWORD, safeEqual } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * TEMPORARY login diagnostic — delete this file once login works.
 * Shows what the deployment actually received, without revealing the password.
 *   /api/auth/diag                          → masked email + lengths
 *   /api/auth/diag?email=you@example.com    → also says whether that email matches
 */
export async function GET(req: Request) {
  const rawEmail = process.env.ADMIN_EMAIL ?? null;
  const rawPass = process.env.ADMIN_PASSWORD ?? null;
  const rawSecret = process.env.AUTH_SECRET ?? null;
  const email = ADMIN_EMAIL();
  const pass = ADMIN_PASSWORD();

  const mask = (e: string) => {
    const [u, d] = e.split("@");
    return d ? `${u.slice(0, 2)}***@${d}` : `${e.slice(0, 2)}*** (no @ — wrong value?)`;
  };
  const issues = (raw: string | null) =>
    raw === null
      ? "MISSING"
      : [
          /\s/.test(raw.trim()) && "contains spaces/newlines inside",
          /^[A-Z_]+=/.test(raw.trim()) && "value starts with 'KEY=' — remove that prefix",
          raw !== raw.trim() && "had spaces at start/end (ignored)",
        ].filter(Boolean).join("; ") || "looks fine";

  const tryEmail = new URL(req.url).searchParams.get("email");

  return NextResponse.json({
    ADMIN_EMAIL: rawEmail === null ? "MISSING" : mask(email),
    ADMIN_EMAIL_check: issues(rawEmail),
    ...(tryEmail !== null && { email_you_typed_matches: safeEqual(tryEmail.trim().toLowerCase(), email) }),
    ADMIN_PASSWORD_length: rawPass === null ? "MISSING" : pass.length,
    ADMIN_PASSWORD_check: issues(rawPass),
    AUTH_SECRET_length: rawSecret === null ? "MISSING" : rawSecret.trim().length,
    vercel_env: process.env.VERCEL_ENV ?? "not on Vercel",
    deployment: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? null,
  });
}
