import { NextRequest, NextResponse } from 'next/server';
import { appStore } from '@/lib/storage/store';

export async function POST(req: NextRequest) {
  try {
    const { targetId, sourceId } = await req.json();
    if (!targetId || !sourceId) {
      return NextResponse.json({ error: 'Both targetId and sourceId are required' }, { status: 400 });
    }

    const merged = appStore.mergeBusinesses(targetId, sourceId);
    if (!merged) {
      return NextResponse.json({ error: 'Failed to merge businesses. Please verify IDs.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, business: merged });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Merge failed' }, { status: 500 });
  }
}
