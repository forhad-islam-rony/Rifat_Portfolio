import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { getProfile } from "@/lib/data";

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
