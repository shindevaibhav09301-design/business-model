export interface ServiceResponse<T> {
  success: boolean;
  data: T;
  total?: number;
  message?: string;
}

export interface LeadRecord {
  id: string;
  businessId: string;
  businessName: string;
  category: string;
  city: string;
  phone: string;
  email?: string;
  websiteStatus: 'None' | 'Unverified' | 'Verified';
  opportunityScore: number; // 0 - 100
  stage: 'new' | 'contacted' | 'interested' | 'followup' | 'converted' | 'closed';
  estimatedValue: string;
  assignedTo: string;
  lastContactedAt?: string;
  notes: string;
  createdAt: string;
}

export interface ExecutiveReport {
  id: string;
  title: string;
  district: string;
  generatedAt: string;
  totalEntities: number;
  verifiedRatio: number;
  websitePenetration: number;
  highValueLeads: number;
  topSectors: { name: string; count: number; growth: string }[];
  summary: string;
}
