export type Profile = {
  id?: string;
  full_name: string;
  headline: string | null;
  tagline: string | null;
  bio: string | null;
  photo_url: string | null;
  cv_url: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  institution: string | null;
  department: string | null;
  degree: string | null;
  cgpa: string | null;
  citations: number;
  h_index: number;
  i10_index: number;
  publications_count: number;
  google_scholar: string | null;
  researchgate: string | null;
  orcid: string | null;
  linkedin: string | null;
  github: string | null;
  twitter: string | null;
  facebook: string | null;
  updated_at?: string;
};

export type Publication = {
  id?: string;
  title: string;
  authors: string;
  venue: string | null;
  year: number | null;
  volume: string | null;
  doi: string | null;
  url: string | null;
  citations: number;
  type: string;
  abstract: string | null;
  tags: string[];
  featured: boolean;
  sort_order: number;
  created_at?: string;
};

export type ResearchArea = {
  id?: string;
  title: string;
  description: string | null;
  icon: string;
  sort_order: number;
};

export type Education = {
  id?: string;
  degree: string;
  institution: string;
  field: string | null;
  start_date: string | null;
  end_date: string | null;
  grade: string | null;
  description: string | null;
  sort_order: number;
};

export type Experience = {
  id?: string;
  role: string;
  organization: string;
  category: string;
  start_date: string | null;
  end_date: string | null;
  location: string | null;
  description: string | null;
  sort_order: number;
};

export type SkillGroup = {
  id?: string;
  category: string;
  items: string[];
  sort_order: number;
};

export type Award = {
  id?: string;
  title: string;
  issuer: string | null;
  year: string | null;
  description: string | null;
  sort_order: number;
};

export type PeerReview = {
  id?: string;
  journal: string;
  publisher: string | null;
  reviews: number;
  period: string | null;
  url: string | null;
  sort_order: number;
};

export type Certification = {
  id?: string;
  title: string;
  issuer: string | null;
  date: string | null;
  category: string; // course | training | conference | recognition
  description: string | null;
  url: string | null;
  sort_order: number;
};

export type Message = {
  id?: string;
  name: string;
  email: string;
  subject: string | null;
  body: string;
  is_read: boolean;
  created_at?: string;
};

export type PortfolioData = {
  profile: Profile;
  publications: Publication[];
  researchAreas: ResearchArea[];
  education: Education[];
  experience: Experience[];
  skills: SkillGroup[];
  awards: Award[];
  peerReviews: PeerReview[];
  certifications: Certification[];
};
