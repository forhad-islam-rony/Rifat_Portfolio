import { createClient } from "./supabase/server";
import { isSupabaseConfigured } from "./supabase/config";
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
 * Every getter tries Supabase first and gracefully falls back to the bundled
 * static data (so the site always renders, even before the DB is connected or
 * if a query fails).
 */

export const revalidate = 0; // always fetch fresh in server components

async function safeQuery<T>(
  run: () => Promise<T>,
  fallback: T
): Promise<T> {
  if (!isSupabaseConfigured) return fallback;
  try {
    const result = await run();
    return result;
  } catch {
    return fallback;
  }
}

export async function getProfile(): Promise<Profile> {
  return safeQuery(async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("profile")
      .select("*")
      .limit(1)
      .maybeSingle();
    if (error || !data) return staticData.profile;
    return data as Profile;
  }, staticData.profile);
}

export async function getPublications(): Promise<Publication[]> {
  return safeQuery(async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("publications")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("year", { ascending: false });
    if (error || !data || data.length === 0) return staticData.publications;
    return data as Publication[];
  }, staticData.publications);
}

export async function getResearchAreas(): Promise<ResearchArea[]> {
  return safeQuery(async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("research_areas")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error || !data || data.length === 0) return staticData.researchAreas;
    return data as ResearchArea[];
  }, staticData.researchAreas);
}

export async function getEducation(): Promise<Education[]> {
  return safeQuery(async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("education")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error || !data || data.length === 0) return staticData.education;
    return data as Education[];
  }, staticData.education);
}

export async function getExperience(): Promise<Experience[]> {
  return safeQuery(async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("experience")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error || !data || data.length === 0) return staticData.experience;
    return data as Experience[];
  }, staticData.experience);
}

export async function getSkills(): Promise<SkillGroup[]> {
  return safeQuery(async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error || !data || data.length === 0) return staticData.skills;
    return data as SkillGroup[];
  }, staticData.skills);
}

export async function getAwards(): Promise<Award[]> {
  return safeQuery(async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("awards")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error || !data || data.length === 0) return staticData.awards;
    return data as Award[];
  }, staticData.awards);
}

export async function getPeerReviews(): Promise<PeerReview[]> {
  return safeQuery(async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("peer_reviews")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error || !data || data.length === 0) return staticData.peerReviews;
    return data as PeerReview[];
  }, staticData.peerReviews);
}

export async function getCertifications(): Promise<Certification[]> {
  return safeQuery(async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("certifications")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error || !data || data.length === 0) return staticData.certifications;
    return data as Certification[];
  }, staticData.certifications);
}

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
