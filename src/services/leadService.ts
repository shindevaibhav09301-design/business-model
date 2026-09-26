import { LeadRecord } from '@/types/enterprise';

// In-memory persistent default leads for Maharashtra enterprise showcases
const INITIAL_LEADS: LeadRecord[] = [
  {
    id: 'lead-001',
    businessId: 'pbn-showcase-002',
    businessName: 'Dr. Katneshwarkar Hospital',
    category: 'Healthcare',
    city: 'Parbhani',
    phone: '+91 2452 227890',
    email: 'katneshwarkar.hospital@gmail.com',
    websiteStatus: 'None',
    opportunityScore: 92,
    stage: 'new',
    estimatedValue: '₹45,000 / setup + ₹8,000/mo',
    assignedTo: 'Enterprise Sales',
    notes: 'Senior medical director interested in patient portal & online appointment booking.',
    createdAt: '2026-09-24T08:30:00Z',
  },
  {
    id: 'lead-002',
    businessId: 'pbn-showcase-004',
    businessName: 'Sahyadri Hospital',
    category: 'Healthcare',
    city: 'Parbhani',
    phone: '+91 2452 229988',
    email: 'sahyadri.parbhani@gmail.com',
    websiteStatus: 'None',
    opportunityScore: 88,
    stage: 'contacted',
    estimatedValue: '₹60,000 / portal',
    assignedTo: 'Healthcare Team',
    lastContactedAt: '2026-09-25T11:00:00Z',
    notes: 'Spoke with Dr. Kadam. Requested demo on emergency bed availability widget.',
    createdAt: '2026-09-23T10:15:00Z',
  },
  {
    id: 'lead-003',
    businessId: 'pbn-showcase-007',
    businessName: 'ABC Computer Institute',
    category: 'Education',
    city: 'Parbhani',
    phone: '+91 2452 225577',
    email: 'abccomputer.pbn@gmail.com',
    websiteStatus: 'None',
    opportunityScore: 85,
    stage: 'interested',
    estimatedValue: '₹35,000 LMS setup',
    assignedTo: 'EdTech Sales',
    lastContactedAt: '2026-09-26T09:30:00Z',
    notes: 'Wants student certificate verification portal and online batch schedule.',
    createdAt: '2026-09-22T14:20:00Z',
  },
  {
    id: 'lead-004',
    businessId: 'pbn-showcase-010',
    businessName: 'Om Medicals',
    category: 'Retail',
    city: 'Parbhani',
    phone: '+91 2452 223399',
    email: 'ommedicals.pbn@gmail.com',
    websiteStatus: 'None',
    opportunityScore: 90,
    stage: 'followup',
    estimatedValue: '₹25,000 / WhatsApp e-store',
    assignedTo: 'SMB Team',
    lastContactedAt: '2026-09-25T16:45:00Z',
    notes: 'Discussing online medicine prescription upload & local courier delivery integration.',
    createdAt: '2026-09-21T12:00:00Z',
  },
  {
    id: 'lead-005',
    businessId: 'demo-parbhani-005',
    businessName: 'Patil Medical & Diagnostic Center',
    category: 'Healthcare',
    city: 'Parbhani',
    phone: '+91 2452 223456',
    email: 'patildiagnostics.pbn@gmail.com',
    websiteStatus: 'None',
    opportunityScore: 89,
    stage: 'converted',
    estimatedValue: '₹75,000 Lab MIS',
    assignedTo: 'Dr. Vaibhav Shinde',
    lastContactedAt: '2026-09-26T12:00:00Z',
    notes: 'Signed contract for automated WhatsApp lab report delivery platform.',
    createdAt: '2026-09-18T10:00:00Z',
  },
];

let leadsStore: LeadRecord[] = [...INITIAL_LEADS];

export const leadService = {
  async getLeads(): Promise<LeadRecord[]> {
    return [...leadsStore];
  },

  async updateLeadStage(leadId: string, newStage: LeadRecord['stage']): Promise<LeadRecord | null> {
    const lead = leadsStore.find((l) => l.id === leadId);
    if (!lead) return null;
    lead.stage = newStage;
    lead.lastContactedAt = new Date().toISOString();
    return { ...lead };
  },

  async createLead(leadData: Omit<LeadRecord, 'id' | 'createdAt'>): Promise<LeadRecord> {
    const newLead: LeadRecord = {
      ...leadData,
      id: `lead-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    leadsStore = [newLead, ...leadsStore];
    return newLead;
  },

  async deleteLead(leadId: string): Promise<boolean> {
    leadsStore = leadsStore.filter((l) => l.id !== leadId);
    return true;
  },
};
