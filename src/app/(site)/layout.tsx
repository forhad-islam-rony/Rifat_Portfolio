import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { getProfile } from "@/lib/data";

// Render public pages on each request so edits made in the dashboard appear
// immediately (without this, Next.js bakes the pages at build time and changes
// only show up after a redeploy).
export const dynamic = "force-dynamic";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getProfile();
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer profile={profile} />
    </div>
  );
}
