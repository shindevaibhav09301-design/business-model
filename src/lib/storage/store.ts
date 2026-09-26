import { BusinessRecord, CategoryTaxonomy, DiscoveryJobProgress, DuplicateMergeCandidate } from '@/types';
import { BENCHMARK_BUSINESSES } from '@/lib/data/benchmark-businesses';
import { EXPANDED_BUSINESSES } from '@/lib/data/benchmark-businesses-expanded';
import { PARBHANI_SHOWCASE_BUSINESSES } from '@/lib/data/benchmark-parbhani-showcase';
import { DEFAULT_TAXONOMY } from '@/lib/data/categories';

export interface AdminSettings {
  googleMapsApiKey: string;
  searchApiKey: string;
  aiApiKey: string;
  crawler: {
    maxPagesPerDomain: number;
    maxDepth: number;
    delayBetweenRequestsMs: number;
    timeoutMs: number;
    retryCount: number;
    respectRobotsTxt: boolean;
  };
  providers: {
    enableOsm: boolean;
    enableGoogle: boolean;
    enableWebDiscovery: boolean;
    enableDemoData: boolean;
  };
  deduplication: {
    autoMergeThreshold: number; // e.g. 85
    reviewFlagThreshold: number; // e.g. 65
  };
}

class MemoryStore {
  private businesses: Map<string, BusinessRecord> = new Map();
  private jobs: Map<string, DiscoveryJobProgress> = new Map();
  private categories: CategoryTaxonomy[] = DEFAULT_TAXONOMY;
  private duplicateCandidates: DuplicateMergeCandidate[] = [];
  private settings: AdminSettings = {
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || '',
    searchApiKey: process.env.SEARCH_API_KEY || '',
    aiApiKey: process.env.AI_API_KEY || process.env.GEMINI_API_KEY || '',
    crawler: {
      maxPagesPerDomain: 5,
      maxDepth: 2,
      delayBetweenRequestsMs: 500,
      timeoutMs: 8000,
      retryCount: 2,
      respectRobotsTxt: true,
    },
    providers: {
      enableOsm: true,
      enableGoogle: true,
      enableWebDiscovery: true,
      enableDemoData: true,
    },
    deduplication: {
      autoMergeThreshold: 85,
      reviewFlagThreshold: 65,
    },
  };

  constructor() {
    // Seed initial benchmark records
    for (const biz of BENCHMARK_BUSINESSES) {
      this.businesses.set(biz.business_id, { ...biz });
    }
    // Seed expanded businesses (Hyderabad, Delhi, additional Pune/Mumbai/Parbhani/Nashik)
    for (const biz of EXPANDED_BUSINESSES) {
      this.businesses.set(biz.business_id, { ...biz });
    }
    // Seed showcase businesses (Ankur Hospital, Devansh Edutech, etc.)
    for (const biz of PARBHANI_SHOWCASE_BUSINESSES) {
      this.businesses.set(biz.business_id, { ...biz });
    }
  }

  // --- BUSINESS METHODS ---
  public getBusinesses(filters?: {
    city?: string;
    category?: string;
    subcategory?: string;
    businessType?: string | string[];
    websiteStatus?: string; // 'with_website' | 'no_website' | 'verified' | 'unverified'
    contactStatus?: string; // 'has_phone' | 'has_email' | 'both' | 'none'
    verificationStatus?: string;
    minRating?: number;
    minScore?: number;
    query?: string;
    isMock?: boolean;
    area?: string;
  }): BusinessRecord[] {
    let list = Array.from(this.businesses.values());

    if (!filters) return list;

    if (filters.city && filters.city !== 'All') {
      const c = filters.city.toLowerCase().trim();
      list = list.filter((b) => b.city.toLowerCase() === c || b.address.toLowerCase().includes(c));
    }

    if (filters.category && filters.category !== 'All') {
      const cat = filters.category.toLowerCase().trim();
      list = list.filter((b) => {
        const bCat = (b.business_category || '').toLowerCase().trim();
        const bSub = (b.business_subcategory || '').toLowerCase().trim();
        if (bCat === cat) return true;

        if (cat === 'classes') {
          return bCat.includes('class') || bSub.includes('class') || bSub.includes('coaching') || bSub.includes('tuition') || bSub.includes('training');
        }
        if (cat === 'institutions') {
          return bCat.includes('institution') || bSub.includes('institute') || bSub.includes('college') || bSub.includes('university') || bSub.includes('school');
        }
        if (cat === 'shops' || cat.includes('shop')) {
          return bCat === 'retail' || bCat === 'retail & shopping' || bCat.includes('shop') || bSub.includes('shop') || bSub.includes('store') || bSub.includes('mart');
        }
        if (cat.includes('retail')) {
          return bCat === 'shops' || bCat === 'retail' || bCat === 'retail & shopping' || bSub.includes('shop') || bSub.includes('store');
        }
        if (cat === 'education') {
          return bCat === 'education' || bCat === 'classes' || bCat === 'institutions';
        }
        return false;
      });
    }

    if (filters.subcategory && filters.subcategory !== 'All') {
      const sub = filters.subcategory.toLowerCase();
      list = list.filter((b) => b.business_subcategory.toLowerCase() === sub);
    }

    if (filters.businessType) {
      const types = (Array.isArray(filters.businessType) ? filters.businessType : [filters.businessType])
        .map((t) => t.toLowerCase().trim())
        .filter(Boolean);
      if (types.length > 0) {
        list = list.filter((b) => {
          const sub = (b.business_subcategory || '').toLowerCase();
          const cat = (b.business_category || '').toLowerCase();
          const name = (b.business_name || '').toLowerCase();
          return types.some((t) => sub.includes(t) || cat.includes(t) || name.includes(t));
        });
      }
    }

    if (filters.websiteStatus) {
      if (filters.websiteStatus === 'with_website') {
        list = list.filter((b) => Boolean(b.website));
      } else if (filters.websiteStatus === 'no_website') {
        list = list.filter((b) => !b.website);
      } else if (filters.websiteStatus === 'verified') {
        list = list.filter((b) => b.website_status === 'Verified');
      } else if (filters.websiteStatus === 'unverified') {
        list = list.filter((b) => b.website_status === 'Unverified');
      }
    }

    if (filters.contactStatus) {
      if (filters.contactStatus === 'has_phone') {
        list = list.filter((b) => b.phone_numbers.length > 0);
      } else if (filters.contactStatus === 'has_email') {
        list = list.filter((b) => b.email_addresses.length > 0);
      } else if (filters.contactStatus === 'both') {
        list = list.filter((b) => b.phone_numbers.length > 0 && b.email_addresses.length > 0);
      } else if (filters.contactStatus === 'none') {
        list = list.filter((b) => b.phone_numbers.length === 0 && b.email_addresses.length === 0);
      }
    }

    if (filters.verificationStatus && filters.verificationStatus !== 'All') {
      list = list.filter((b) => b.verification_status === filters.verificationStatus);
    }

    if (filters.minScore !== undefined && filters.minScore > 0) {
      list = list.filter((b) => (b.data_confidence ?? 0) >= filters.minScore!);
    }

    if (filters.minRating) {
      list = list.filter((b) => (b.rating ?? 0) >= filters.minRating!);
    }

    if (filters.area && filters.area !== 'All') {
      const a = filters.area.toLowerCase();
      list = list.filter((b) => b.area.toLowerCase().includes(a) || b.address.toLowerCase().includes(a));
    }

    if (filters.query && filters.query.trim()) {
      const q = filters.query.toLowerCase().trim();
      list = list.filter(
        (b) =>
          b.business_name.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q) ||
          b.business_category.toLowerCase().includes(q) ||
          b.business_subcategory.toLowerCase().includes(q) ||
          b.city.toLowerCase().includes(q) ||
          (b.district && b.district.toLowerCase().includes(q)) ||
          b.address.toLowerCase().includes(q) ||
          b.courses.some((c) => c.toLowerCase().includes(q)) ||
          b.services.some((s) => s.toLowerCase().includes(q)) ||
          (b.specialties && b.specialties.some((s) => s.toLowerCase().includes(q))) ||
          b.phone_numbers.some((p) => p.includes(q)) ||
          b.email_addresses.some((e) => e.toLowerCase().includes(q)) ||
          (b.website && b.website.toLowerCase().includes(q))
      );
    }

    return list;
  }

  public getBusinessById(id: string): BusinessRecord | undefined {
    return this.businesses.get(id);
  }

  public saveBusiness(record: BusinessRecord): void {
    this.businesses.set(record.business_id, record);
  }

  public updateBusiness(id: string, updates: Partial<BusinessRecord>): BusinessRecord | null {
    const existing = this.businesses.get(id);
    if (!existing) return null;
    const updated = {
      ...existing,
      ...updates,
      updated_at: new Date().toISOString(),
    };
    this.businesses.set(id, updated);
    return updated;
  }

  public deleteBusiness(id: string): boolean {
    return this.businesses.delete(id);
  }

  public mergeBusinesses(targetId: string, sourceId: string): BusinessRecord | null {
    const target = this.businesses.get(targetId);
    const source = this.businesses.get(sourceId);
    if (!target || !source) return null;

    // Merge non-duplicate phones
    const phoneSet = new Set([...target.phone_numbers, ...source.phone_numbers]);
    const emailSet = new Set([...target.email_addresses, ...source.email_addresses]);
    const courseSet = new Set([...target.courses, ...source.courses]);
    const serviceSet = new Set([...target.services, ...source.services]);
    const sourceNames = Array.from(new Set([...target.source_names, ...source.source_names]));
    const sourceUrls = Array.from(new Set([...target.source_urls, ...source.source_urls]));

    const merged: BusinessRecord = {
      ...target,
      phone_numbers: Array.from(phoneSet),
      email_addresses: Array.from(emailSet),
      courses: Array.from(courseSet),
      services: Array.from(serviceSet),
      source_names: sourceNames,
      source_urls: sourceUrls,
      website: target.website || source.website,
      official_website: target.official_website || source.official_website,
      website_status: target.website_status === 'Verified' ? 'Verified' : source.website_status,
      field_provenance: {
        ...source.field_provenance,
        ...target.field_provenance,
      },
      data_confidence: Math.max(target.data_confidence, source.data_confidence),
      updated_at: new Date().toISOString(),
    };

    this.businesses.set(targetId, merged);
    this.businesses.delete(sourceId);
    return merged;
  }

  // --- JOB METHODS ---
  public getDiscoveryJob(id: string): DiscoveryJobProgress | undefined {
    return this.jobs.get(id);
  }

  public getAllJobs(): DiscoveryJobProgress[] {
    return Array.from(this.jobs.values()).sort(
      (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
    );
  }

  public saveDiscoveryJob(job: DiscoveryJobProgress): void {
    this.jobs.set(job.jobId, job);
  }

  // --- DUPLICATE AUDIT METHODS ---
  public addDuplicateCandidate(candidate: DuplicateMergeCandidate): void {
    this.duplicateCandidates.unshift(candidate);
  }

  public getDuplicateCandidates(): DuplicateMergeCandidate[] {
    return this.duplicateCandidates;
  }

  // --- SETTINGS & TAXONOMY ---
  public getAdminSettings(): AdminSettings {
    return { ...this.settings };
  }

  public updateAdminSettings(patch: Partial<AdminSettings>): AdminSettings {
    this.settings = {
      ...this.settings,
      ...patch,
      crawler: { ...this.settings.crawler, ...(patch.crawler || {}) },
      providers: { ...this.settings.providers, ...(patch.providers || {}) },
      deduplication: { ...this.settings.deduplication, ...(patch.deduplication || {}) },
    };
    return this.settings;
  }

  public getCategories(): CategoryTaxonomy[] {
    return DEFAULT_TAXONOMY;
  }

  public updateCategories(categories: CategoryTaxonomy[]): void {
    this.categories = categories;
  }
}

// Global Singleton in NodeJS across all Next.js API routes & server components
const globalForStore = globalThis as unknown as { appStore?: MemoryStore };
if (!globalForStore.appStore) {
  globalForStore.appStore = new MemoryStore();
} else {
  Object.setPrototypeOf(globalForStore.appStore, MemoryStore.prototype);
  for (const biz of PARBHANI_SHOWCASE_BUSINESSES) {
    globalForStore.appStore.saveBusiness({ ...biz });
  }
}
export const appStore = globalForStore.appStore;
