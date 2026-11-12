import { getDb, isDbConfigured } from "./server/mongodb";
import { serialize, serializeAll } from "./server/collections";
import { staticData } from "./static-data";
import type {
  Profile,
  Publication,
  ResearchArea,
  Education,
  Experience,
  SkillGroup,
  Award,
  PeerReview,
  Certification,
} from "./types";

/**
 * Central data-access layer for the public portfolio.
 *
 * MongoDB is the source of truth. The bundled static data is used ONLY when
 * the database is not configured or cannot be reached, so the public site still
 * renders during an outage. (On the very first connection the database is
 * seeded from that same static data — see server/mongodb.ts.)
 */

async function list<T>(collection: string, fallback: T[]): Promise<T[]> {
  if (!isDbConfigured) return fallback;
  try {
    const db = await getDb();
    const docs = await db.collection(collection).find().sort({ sort_order: 1, _id: 1 }).toArray();
    return serializeAll<T>(docs);
  } catch (err) {
    console.error(`[data] ${collection}: falling back to static data —`, (err as Error)?.message);
    return fallback;
  }
}

export async function getProfile(): Promise<Profile> {
  if (!isDbConfigured) return staticData.profile;
  try {
    const db = await getDb();
    const doc = await db.collection("profile").findOne({}, { sort: { _id: 1 } });
    return serialize<Profile>(doc) ?? staticData.profile;
  } catch (err) {
    console.error("[data] profile: falling back to static data —", (err as Error)?.message);
    return staticData.profile;
  }
}

export async function getPublications(): Promise<Publication[]> {
  const rows = await list<Publication>("publications", staticData.publications);
  // Same ordering as before: manual order first, then newest year.
  return [...rows].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0) || (b.year ?? 0) - (a.year ?? 0));
}

export const getResearchAreas = () => list<ResearchArea>("research_areas", staticData.researchAreas);
export const getEducation = () => list<Education>("education", staticData.education);
export const getExperience = () => list<Experience>("experience", staticData.experience);
export const getSkills = () => list<SkillGroup>("skills", staticData.skills);
export const getAwards = () => list<Award>("awards", staticData.awards);
export const getPeerReviews = () => list<PeerReview>("peer_reviews", staticData.peerReviews);
export const getCertifications = () => list<Certification>("certifications", staticData.certifications);

/** Derived citation metrics computed from the live publication list. */
export function computeMetrics(publications: Publication[]) {
  const citations = publications.reduce((sum, p) => sum + (p.citations || 0), 0);
  const sorted = [...publications]
    .map((p) => p.citations || 0)
    .sort((a, b) => b - a);
  let hIndex = 0;
  for (let i = 0; i < sorted.length; i++) {
    if (sorted[i] >= i + 1) hIndex = i + 1;
    else break;
  }
  const i10 = sorted.filter((c) => c >= 10).length;
  return { citations, hIndex, i10, count: publications.length };
}
