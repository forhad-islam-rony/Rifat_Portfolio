import type { Profile } from "@/lib/types";

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function Avatar({
  profile,
  className = "",
}: {
  profile: Profile;
  className?: string;
}) {
  if (profile.photo_url) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={profile.photo_url}
        alt={profile.full_name}
        className={`object-cover ${className}`}
      />
    );
  }
  return (
    <div
      className={`flex items-center justify-center bg-gradient-to-br from-graphite-700 via-graphite-800 to-graphite-900 ${className}`}
    >
      <span className="font-display text-4xl font-semibold text-amber-500">
        {initials(profile.full_name)}
      </span>
    </div>
  );
}
