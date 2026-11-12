import { ObjectId, type Document, type WithId } from "mongodb";

/**
 * Whitelist of collections the dashboard may edit, and the fields (with types)
 * each one accepts. Anything not listed is dropped before it reaches MongoDB,
 * so the API can't be used to write arbitrary data.
 */
type FieldType = "string" | "number" | "boolean" | "string[]";
type Schema = Record<string, FieldType>;

const str = "string" as const;
const num = "number" as const;
const bool = "boolean" as const;
const arr = "string[]" as const;

export const SCHEMAS: Record<string, Schema> = {
  profile: {
    full_name: str, headline: str, tagline: str, bio: str, photo_url: str, cv_url: str,
    email: str, phone: str, location: str, institution: str, department: str, degree: str,
    cgpa: str, citations: num, h_index: num, i10_index: num, publications_count: num,
    google_scholar: str, researchgate: str, orcid: str, linkedin: str, github: str,
    twitter: str, facebook: str,
  },
  publications: {
    title: str, authors: str, venue: str, year: num, volume: str, doi: str, url: str,
    citations: num, type: str, abstract: str, tags: arr, featured: bool, sort_order: num,
  },
  research_areas: { title: str, description: str, icon: str, sort_order: num },
  education: {
    degree: str, institution: str, field: str, start_date: str, end_date: str, grade: str,
    description: str, sort_order: num,
  },
  experience: {
    role: str, organization: str, category: str, start_date: str, end_date: str,
    location: str, description: str, sort_order: num,
  },
  skills: { category: str, items: arr, sort_order: num },
  awards: { title: str, issuer: str, year: str, description: str, sort_order: num },
  peer_reviews: { journal: str, publisher: str, reviews: num, period: str, url: str, sort_order: num },
  certifications: {
    title: str, issuer: str, date: str, category: str, description: str, url: str, sort_order: num,
  },
  messages: { name: str, email: str, subject: str, body: str, is_read: bool },
};

/** Collections managed by the generic list editor (everything except profile/messages). */
export const LIST_COLLECTIONS = [
  "publications", "research_areas", "education", "experience",
  "skills", "awards", "peer_reviews", "certifications",
] as const;

export const ALL_COLLECTIONS = ["profile", ...LIST_COLLECTIONS, "messages"] as const;

export function isListCollection(name: string): name is (typeof LIST_COLLECTIONS)[number] {
  return (LIST_COLLECTIONS as readonly string[]).includes(name);
}

/** Coerce + filter an incoming payload against a collection's schema. */
export function sanitize(collection: string, input: unknown, partial = true): Document {
  const schema = SCHEMAS[collection];
  if (!schema) throw new Error(`Unknown collection: ${collection}`);
  const src = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
  const out: Document = {};
  for (const [key, type] of Object.entries(schema)) {
    if (!(key in src)) {
      if (!partial) out[key] = type === "string[]" ? [] : type === "number" ? 0 : type === "boolean" ? false : null;
      continue;
    }
    const v = src[key];
    switch (type) {
      case "string":
        out[key] = v === null || v === undefined || v === "" ? null : String(v).slice(0, 20000);
        break;
      case "number": {
        if (v === null || v === "" || v === undefined) { out[key] = key === "year" ? null : 0; break; }
        const n = Number(v);
        out[key] = Number.isFinite(n) ? n : 0;
        break;
      }
      case "boolean":
        out[key] = v === true || v === "true" || v === 1 || v === "1";
        break;
      case "string[]":
        out[key] = Array.isArray(v)
          ? v.map((x) => String(x).trim()).filter(Boolean)
          : String(v ?? "").split(",").map((x) => x.trim()).filter(Boolean);
        break;
    }
  }
  return out;
}

export function toObjectId(id: string): ObjectId | null {
  return ObjectId.isValid(id) && String(new ObjectId(id)) === id ? new ObjectId(id) : null;
}

/** Convert a Mongo document to the plain shape the UI expects (`id` string, ISO dates). */
export function serialize<T = any>(doc: WithId<Document> | null): T | null {
  if (!doc) return null;
  const { _id, ...rest } = doc;
  const out: Record<string, any> = { id: String(_id) };
  for (const [k, v] of Object.entries(rest)) out[k] = v instanceof Date ? v.toISOString() : v;
  return out as T;
}

export function serializeAll<T = any>(docs: WithId<Document>[]): T[] {
  return docs.map((d) => serialize<T>(d)!) as T[];
}
