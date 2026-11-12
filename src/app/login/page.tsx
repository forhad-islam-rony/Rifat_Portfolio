import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Hexagon, ArrowLeft } from "lucide-react";
import { LoginForm } from "@/components/dashboard/login-form";
import { isAuthConfigured } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Dashboard Login",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function LoginPage() {
  const configured = isAuthConfigured();
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-graphite-950 px-5 py-12">
      <div className="pointer-events-none absolute inset-0 bg-grid-line [background-size:40px_40px] opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-radial-fade" />
      <div className="relative w-full max-w-md">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 font-mono text-sm text-fg-muted transition-colors hover:text-amber-400"
        >
          <ArrowLeft className="h-4 w-4" /> back to portfolio
        </Link>

        <div className="panel rounded-2xl p-8">
          <div className="flex flex-col items-center text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-xl border border-line-strong bg-graphite-750 text-amber-500">
              <Hexagon className="h-7 w-7" strokeWidth={2.2} />
            </span>
            <h1 className="display mt-4 text-2xl">Dashboard Access</h1>
            <p className="mt-1.5 text-sm text-fg-muted">
              Sign in to manage your research portfolio.
            </p>
          </div>

          {configured ? (
            <Suspense fallback={null}>
              <LoginForm />
            </Suspense>
          ) : (
            <div className="mt-6 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-amber-200/90">
              <p className="font-semibold text-amber-300">Admin login not configured yet</p>
              <p className="mt-1 leading-relaxed">
                Set <code className="font-mono">ADMIN_EMAIL</code>,{" "}
                <code className="font-mono">ADMIN_PASSWORD</code> and{" "}
                <code className="font-mono">AUTH_SECRET</code> in{" "}
                <code className="font-mono">.env.local</code> (or your hosting
                provider&apos;s environment variables), then restart / redeploy. See{" "}
                <code className="font-mono">README.md</code>.
              </p>
            </div>
          )}
        </div>

        <p className="mt-6 text-center font-mono text-xs text-fg-dim">
          Protected area · authorized access only
        </p>
      </div>
    </div>
  );
}
