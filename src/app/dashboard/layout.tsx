import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/shell";
import { getAdmin } from "@/lib/server/session";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const email = await getAdmin();
  if (!email) redirect("/login");
  return <DashboardShell userEmail={email}>{children}</DashboardShell>;
}
