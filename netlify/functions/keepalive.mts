// Netlify Scheduled Function — runs once a day and pings /api/health, which
// touches MongoDB. Free Atlas clusters are paused after a period with ZERO
// connections; this daily ping keeps the cluster active even if nobody visits
// the site for weeks.
export default async () => {
  const site = process.env.URL || process.env.DEPLOY_PRIME_URL;
  if (!site) return new Response("no site URL");
  const res = await fetch(`${site}/api/health`).catch((e) => ({ status: 0, statusText: String(e) }) as Response);
  console.log(`[keepalive] ${site}/api/health → ${res.status}`);
  return new Response(`ok ${res.status}`);
};

export const config = { schedule: "@daily" };
