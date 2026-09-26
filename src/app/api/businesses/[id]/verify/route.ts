import { NextRequest, NextResponse } from 'next/server';
import { appStore } from '@/lib/storage/store';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const business = appStore.getBusinessById(params.id);
  if (!business) {
    return NextResponse.json({ error: 'Business not found' }, { status: 404 });
  }

  const updated = appStore.updateBusiness(params.id, {
    verification_status: 'Verified',
    data_confidence: Math.max(business.data_confidence, 95),
    confidence_level: 'High',
    last_verified_at: new Date().toISOString(),
  });

  return NextResponse.json({ success: true, business: updated });
}
