import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/shell";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // If Supabase isn't configured we can't authenticate — send to login,
  // which explains the setup steps.
  if (!isSupabaseConfigured) redirect("/login");

  let user = null;
  try {
    const supabase = createClient();
    const result = await supabase.auth.getUser();
    user = result.data.user;
  } catch {
    redirect("/login");
  }

  if (!user) redirect("/login");

  return <DashboardShell userEmail={user.email}>{children}</DashboardShell>;
}
