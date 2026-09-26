import { NextRequest, NextResponse } from 'next/server';
import { appStore } from '@/lib/storage/store';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const city = searchParams.get('city') || undefined;
  const category = searchParams.get('category') || undefined;
  const subcategory = searchParams.get('subcategory') || undefined;
  const websiteStatus = searchParams.get('websiteStatus') || undefined;
  const contactStatus = searchParams.get('contactStatus') || undefined;
  const verificationStatus = searchParams.get('verificationStatus') || undefined;
  const minRating = searchParams.get('minRating') ? parseFloat(searchParams.get('minRating')!) : undefined;
  const minScore = searchParams.get('minScore') ? parseInt(searchParams.get('minScore')!, 10) : undefined;
  const businessType = searchParams.get('businessType') || undefined;
  const area = searchParams.get('area') || undefined;
  const query = searchParams.get('query') || undefined;

  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '20', 10);

  const filtered = appStore.getBusinesses({
    city,
    category,
    subcategory,
    businessType: businessType ? businessType.split(',') : undefined,
    websiteStatus,
    contactStatus,
    verificationStatus,
    minRating,
    minScore,
    area,
    query,
  });

  const total = filtered.length;
  const startIndex = (page - 1) * limit;
  const paginated = filtered.slice(startIndex, startIndex + limit);

  // Collect unique cities and areas for filter dropdowns
  const all = appStore.getBusinesses();
  const cities = Array.from(new Set(all.map((b) => b.city))).sort();
  const areas = Array.from(new Set(all.map((b) => b.area).filter(Boolean))).sort();

  return NextResponse.json({
    businesses: paginated,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
    availableCities: cities,
    availableAreas: areas,
  });
}
