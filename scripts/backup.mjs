// Usage: npm run backup
// Writes backups/portfolio-backup-YYYY-MM-DD.json with every collection + uploaded file.
// Restore it from Dashboard → Overview → Backup & restore → Restore.
import { MongoClient, GridFSBucket } from "mongodb";
import { mkdirSync, writeFileSync } from "node:fs";
import { loadEnv } from "./_env.mjs";

loadEnv();
const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI is not set in .env.local");
  process.exit(1);
}
const COLLECTIONS = ["profile", "publications", "research_areas", "education", "experience",
  "skills", "awards", "peer_reviews", "certifications", "messages"];

const client = await new MongoClient(uri).connect();
const db = client.db(process.env.MONGODB_DB || "portfolio");

const ser = (d) => {
  const { _id, ...rest } = d;
  const o = { id: String(_id) };
  for (const [k, v] of Object.entries(rest)) o[k] = v instanceof Date ? v.toISOString() : v;
  return o;
};

const collections = {};
for (const c of COLLECTIONS) collections[c] = (await db.collection(c).find().toArray()).map(ser);

const bucket = new GridFSBucket(db, { bucketName: "files" });
const files = [];
for (const f of await bucket.find().toArray()) {
  const chunks = [];
  for await (const chunk of bucket.openDownloadStream(f._id)) chunks.push(chunk);
  files.push({ id: String(f._id), filename: f.filename, metadata: f.metadata, data: Buffer.concat(chunks).toString("base64") });
}

mkdirSync("backups", { recursive: true });
const out = `backups/portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`;
writeFileSync(out, JSON.stringify({ app: "rifat-portfolio", version: 1, exported_at: new Date().toISOString(), collections, files }, null, 2));
console.log(`✔ Backup written to ${out}`);
for (const [k, v] of Object.entries(collections)) console.log(`  ${k}: ${v.length}`);
console.log(`  files: ${files.length}`);
await client.close();
