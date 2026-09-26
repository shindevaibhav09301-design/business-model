export type ConfidenceLevel = 'High' | 'Medium' | 'Low';
export type VerificationStatus = 'Verified' | 'Partially Verified' | 'Unverified';
export type WebsiteStatus = 'Verified' | 'Unverified' | 'None';

export interface FieldProvenance<T = any> {
  value: T;
  source: string; // e.g. "Official Website", "Google Places", "OpenStreetMap", "Gov Dataset"
  sourceUrl?: string;
  confidence: number; // 0 to 100
  verifiedAt: string; // ISO date string
}

export interface SocialProfiles {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  twitter?: string;
  other?: string;
}

export interface WebsiteAudit {
  found: boolean;
  url?: string;
  hasHttps: boolean;
  mobileFriendly: boolean;
  hasContactPage: boolean;
  hasEmailFound: boolean;
  hasPhoneFound: boolean;
  hasAboutPage: boolean;
  hasSocialLinks: boolean;
  hasOfferingsFound: boolean;
  lastCheckedAt?: string;
  contentHash?: string;
  changeDetected?: boolean;
}

export interface BusinessRecord {
  business_id: string;
  business_name: string;
  business_category: string; // e.g. "Education", "Healthcare", "Food", etc.
  business_subcategory: string; // e.g. "IT Training Institute", "Hospital", etc.
  ai_normalized_category?: string;

  description: string;

  // Location
  address: string;
  area: string;
  city: string;
  district?: string;
  state: string;
  country: string;
  postal_code: string;
  latitude: number | null;
  longitude: number | null;

  // Contact
  phone_numbers: string[];
  email_addresses: string[];

  // Web
  website: string | null;
  official_website: string | null;
  website_status: WebsiteStatus;
  official_website_confidence: number; // 0.00 to 1.00
  website_audit?: WebsiteAudit;

  google_maps_url?: string;
  google_place_id?: string;

  social_profiles: SocialProfiles;
  opening_hours: string; // e.g. "Mon-Sat: 9:00 AM - 8:00 PM"
  rating: number | null; // e.g. 4.6
  review_count: number;
  price_range: string; // e.g. "₹₹", "$$", or "Moderate"

  // Offerings (Domain specific)
  courses: string[]; // for institutes
  services: string[]; // for IT/services/hospitals/salons
  specialties?: string[]; // medical / clinical specialties
  products: string[]; // for retail/manufacturing

  established_year: number | null;
  owner_name: string | null;
  founder_name: string | null;
  contact_person: string | null;

  // Provenance & Evidence
  source_names: string[];
  source_urls: string[];
  field_provenance: Record<string, FieldProvenance>;

  verification_status: VerificationStatus;
  data_confidence: number; // 0 - 100
  confidence_level: ConfidenceLevel;
  last_verified_at: string;

  is_mock_data: boolean; // Flag to clearly distinguish DEMO DATA vs LIVE DATA

  created_at: string;
  updated_at: string;
}

export interface NormalizedCity {
  city: string;
  state: string;
  country: string;
  country_code: string;
  latitude: number;
  longitude: number;
  aliases: string[];
  formatted: string;
  region?: 'Marathwada' | 'Vidarbha' | 'Konkan' | 'Paschim Maharashtra' | 'Khandesh' | string;
}

export interface CategoryTaxonomy {
  id: string;
  name: string;
  subcategories: string[];
  icon: string;
  color: string;
}

export interface DiscoveryJobProgress {
  jobId: string;
  city: string;
  state: string;
  country: string;
  region?: string;
  status: 'QUEUED' | 'RESOLVING' | 'SEARCHING_PROVIDERS' | 'FINDING_WEBSITES' | 'CRAWLING' | 'AI_EXTRACTING' | 'DEDUPLICATING' | 'VERIFYING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  currentStepMessage: string;
  percent: number;
  discoveredCount: number;
  websitesFoundCount: number;
  websitesAnalyzedCount: number;
  duplicatesRemovedCount: number;
  verifiedCount: number;
  startedAt: string;
  completedAt?: string;
  logs: { timestamp: string; step: string; message: string; type?: 'info' | 'success' | 'warn' | 'error' }[];
  error?: string;
}

export interface DiscoveryOptions {
  city: string;
  country?: string;
  state?: string;
  categories?: string[];
  maxResults?: number;
  searchDepth?: number;
  includeWebsites?: boolean;
  includeSocialProfiles?: boolean;
  includeReviews?: boolean;
  includeContactInfo?: boolean;
  forceMock?: boolean;
}

export interface DuplicateMergeCandidate {
  id: string;
  targetBusinessId: string;
  targetBusinessName: string;
  sourceBusinessId: string;
  sourceBusinessName: string;
  similarityScore: number; // 0 - 100
  reasons: string[];
  merged: boolean;
  timestamp: string;
}
