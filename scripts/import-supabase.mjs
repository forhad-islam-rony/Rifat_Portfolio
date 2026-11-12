// Copy your OLD data from Supabase into MongoDB.
//
// 1. In supabase.com/dashboard open the old project and click "Restore project"
//    (only possible within 90 days of it being paused). Wait until it's running.
// 2. Add these to .env.local (next to MONGODB_URI):
//      SUPABASE_URL=https://wbolcytpxmklvgrfrwuw.supabase.co
//      SUPABASE_KEY=<the old anon / publishable key>
//      SUPABASE_EMAIL=<old dashboard login email>        (optional — needed for messages)
//      SUPABASE_PASSWORD=<old dashboard login password>  (optional — needed for messages)
// 3. Run:  npm run import:supabase
//
// It REPLACES the MongoDB content with what's in Supabase, copies the profile
// photo / CV from Supabase Storage into MongoDB, and also saves a JSON backup
// in backups/ so you keep a copy forever.
import { MongoClient, GridFSBucket } from "mongodb";
import { mkdirSync, writeFileSync } from "node:fs";
import { loadEnv } from "./_env.mjs";

loadEnv();
const { MONGODB_URI, SUPABASE_URL, SUPABASE_KEY, SUPABASE_EMAIL, SUPABASE_PASSWORD } = process.env;
if (!MONGODB_URI || !SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Set MONGODB_URI, SUPABASE_URL and SUPABASE_KEY in .env.local first (see the comment at the top of this file).");
  process.exit(1);
}
const base = SUPABASE_URL.trim().replace(/\/$/, "");
const key = SUPABASE_KEY.trim();

let bearer = key;
if (SUPABASE_EMAIL && SUPABASE_PASSWORD) {
  const r = await fetch(`${base}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: key, "Content-Type": "application/json" },
    body: JSON.stringify({ email: SUPABASE_EMAIL.trim(), password: SUPABASE_PASSWORD }),
  });
  const j = await r.json().catch(() => ({}));
  if (r.ok && j.access_token) {
    bearer = j.access_token;
    console.log("✔ Signed in to Supabase (messages will be included)");
  } else {
    console.warn("⚠ Could not sign in to Supabase — continuing without messages:", j.error_description || j.msg || r.status);
  }
}

async function table(name) {
  const r = await fetch(`${base}/rest/v1/${name}?select=*`, {
    headers: { apikey: key, Authorization: `Bearer ${bearer}` },
  });
  if (!r.ok) {
    const t = await r.text();
    if (r.status === 0 || /paused|not found/i.test(t)) throw new Error(`Supabase is not reachable (is the project restored?): ${t}`);
    console.warn(`⚠ ${name}: ${r.status} ${t.slice(0, 200)}`);
    return [];
  }
  return r.json();
}

const TABLES = ["profile", "publications", "research_areas", "education", "experience",
  "skills", "awards", "peer_reviews", "certifications", "messages"];

const data = {};
try {
  for (const t of TABLES) {
    data[t] = await table(t);
    console.log(`  ${t}: ${data[t].length} rows`);
  }
} catch (e) {
  console.error("✖", e.message);
  process.exit(1);
}

const client = await new MongoClient(MONGODB_URI).connect();
const db = client.db(process.env.MONGODB_DB || "portfolio");
const bucket = new GridFSBucket(db, { bucketName: "files" });

// Copy Supabase Storage files referenced by the profile into GridFS.
async function copyFile(url, kind) {
  if (!url || !/supabase\.co\/storage/.test(url)) return url;
  try {
    const r = await fetch(url);
    if (!r.ok) throw new Error(String(r.status));
    const buf = Buffer.from(await r.arrayBuffer());
    const name = decodeURIComponent(url.split("/").pop() || kind);
    const s = bucket.openUploadStream(name, { metadata: { kind, contentType: r.headers.get("content-type") || "application/octet-stream", uploadedAt: new Date() } });
    await new Promise((res, rej) => s.on("error", rej).on("finish", res).end(buf));
    console.log(`✔ Copied ${kind} from Supabase Storage`);
    return `/api/files/${s.id}`;
  } catch (e) {
    console.warn(`⚠ Could not copy ${kind} (${url}): ${e.message}`);
    return url;
  }
}
for (const p of data.profile) {
  p.photo_url = await copyFile(p.photo_url, "photo");
  p.cv_url = await copyFile(p.cv_url, "cv");
}

const now = new Date();
for (const t of TABLES) {
  if (t === "messages" && bearer === key) continue; // don't wipe messages we couldn't read
  const rows = data[t].map(({ id, ...r }) => ({
    ...r,
    created_at: r.created_at ? new Date(r.created_at) : now,
    updated_at: r.updated_at ? new Date(r.updated_at) : now,
  }));
  if (t !== "profile" || rows.length) {
    await db.collection(t).deleteMany({});
    if (rows.length) await db.collection(t).insertMany(rows);
  }
}
await db.collection("_meta").updateOne({ _id: "seeded" }, { $set: { at: now, source: "supabase-import" } }, { upsert: true });

mkdirSync("backups", { recursive: true });
const out = `backups/supabase-export-${now.toISOString().slice(0, 10)}.json`;
writeFileSync(out, JSON.stringify({ app: "rifat-portfolio", version: 1, exported_at: now.toISOString(), source: "supabase", collections: data }, null, 2));
console.log(`\n✔ Import complete. A raw copy was saved to ${out}`);
await client.close();
