// Trim to defend against accidental leading/trailing spaces in env values
// (a very common cause of "invalid URL / key" errors on hosted platforms).
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

/**
 * Whether Supabase is configured AND the URL looks valid. When false, the site
 * runs entirely on the static fallback data and the dashboard shows a
 * "connect Supabase" notice instead of crashing.
 */
function isValidHttpsUrl(value?: string) {
  if (!value) return false;
  try {
    const u = new URL(value);
    return u.protocol === "https:";
  } catch {
    return false;
  }
}

export const isSupabaseConfigured = Boolean(
  SUPABASE_URL && SUPABASE_ANON_KEY && isValidHttpsUrl(SUPABASE_URL)
);
