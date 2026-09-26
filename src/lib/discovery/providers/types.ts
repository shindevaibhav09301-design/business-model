export interface SearchParams {
  city: string;
  state?: string;
  country?: string;
  category?: string;
  subcategory?: string;
  query?: string;
  limit?: number;
  latitude?: number;
  longitude?: number;
}

export interface RawBusinessResult {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  description?: string;
  address: string;
  area?: string;
  city: string;
  state?: string;
  country?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  email?: string;
  website?: string;
  openingHours?: string;
  socialProfiles?: Record<string, string>;
  services?: string[];
  products?: string[];
  source: string;
  sourceUrl?: string;
  placeId?: string;
  rating?: number;
  reviewCount?: number;
  isMock?: boolean;
}

export interface WebsiteSearchParams {
  businessName: string;
  city: string;
  state?: string;
  address?: string;
}

export interface WebsiteResult {
  url: string | null;
  confidence: number; // 0.00 to 1.00
  isOfficial: boolean;
  matchReasons: string[];
}

export interface CrawlOptions {
  maxPages?: number;
  timeoutMs?: number;
  respectRobotsTxt?: boolean;
}

export interface CrawlResult {
  url: string;
  pagesCrawled: number;
  title: string;
  metaDescription?: string;
  bodyTextSnippet: string;
  phonesFound: string[];
  emailsFound: string[];
  socialLinks: Record<string, string>;
  coursesFound: string[];
  servicesFound: string[];
  hasAboutPage: boolean;
  hasContactPage: boolean;
  contentHash: string;
  isMobileFriendly: boolean;
}

export interface IBusinessDiscoveryProvider {
  name: string;
  isConfigured(): boolean;
  searchBusinesses(params: SearchParams): Promise<RawBusinessResult[]>;
}

export interface IWebsiteDiscoveryProvider {
  name: string;
  findOfficialWebsite(params: WebsiteSearchParams): Promise<WebsiteResult>;
}

export interface IWebsiteCrawler {
  crawl(url: string, options?: CrawlOptions): Promise<CrawlResult | null>;
}
