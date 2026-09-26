import { NextRequest, NextResponse } from 'next/server';
import { appStore } from '@/lib/storage/store';
import { ContactEnricher } from '@/lib/discovery/engine/contact-enricher';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const business = appStore.getBusinessById(params.id);
    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    const updated = await ContactEnricher.enrichBusiness(business);
    return NextResponse.json({ success: true, business: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to enrich business' }, { status: 500 });
  }
}
