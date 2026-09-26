import { BusinessRecord } from '@/types';

export interface BusinessQueryParams {
  city?: string;
  category?: string;
  subcategory?: string;
  businessType?: string | string[];
  websiteStatus?: string;
  verificationStatus?: string;
  minScore?: number;
  query?: string;
  page?: number;
  limit?: number;
  sortBy?: 'score' | 'name' | 'city' | 'verified';
  sortOrder?: 'asc' | 'desc';
}

export const businessService = {
  async getBusinesses(params: BusinessQueryParams = {}): Promise<{
    businesses: BusinessRecord[];
    total: number;
    page: number;
    totalPages: number;
    availableCities: string[];
    availableAreas: string[];
  }> {
    const search = new URLSearchParams();
    if (params.city && params.city !== 'All') search.set('city', params.city);
    if (params.category && params.category !== 'All' && params.category !== 'All Categories') {
      search.set('category', params.category);
    }
    if (params.subcategory && params.subcategory !== 'All') search.set('subcategory', params.subcategory);
    if (params.businessType) {
      const typeStr = Array.isArray(params.businessType) ? params.businessType.join(',') : params.businessType;
      if (typeStr) search.set('businessType', typeStr);
    }
    if (params.websiteStatus) search.set('websiteStatus', params.websiteStatus);
    if (params.verificationStatus && params.verificationStatus !== 'Any') {
      search.set('verificationStatus', params.verificationStatus);
    }
    if (params.minScore !== undefined && params.minScore > 0) {
      search.set('minScore', params.minScore.toString());
    }
    if (params.query?.trim()) search.set('query', params.query.trim());
    search.set('page', (params.page || 1).toString());
    search.set('limit', (params.limit || 24).toString());

    const res = await fetch(`/api/businesses?${search.toString()}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch businesses: ${res.statusText}`);
    }
    return res.json();
  },

  async getBusinessById(id: string): Promise<BusinessRecord | null> {
    const res = await fetch(`/api/businesses/${id}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.business || null;
  },

  async verifyBusiness(id: string): Promise<BusinessRecord> {
    const res = await fetch(`/api/businesses/${id}/verify`, { method: 'POST' });
    if (!res.ok) throw new Error('Verification failed');
    const data = await res.json();
    return data.business;
  },

  async enrichBusiness(id: string): Promise<BusinessRecord> {
    const res = await fetch(`/api/businesses/${id}/enrich`, { method: 'POST' });
    if (!res.ok) throw new Error('Enrichment failed');
    const data = await res.json();
    return data.business;
  },
};
