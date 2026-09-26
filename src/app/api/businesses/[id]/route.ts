import { NextRequest, NextResponse } from 'next/server';
import { appStore } from '@/lib/storage/store';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const business = appStore.getBusinessById(params.id);
  if (!business) {
    return NextResponse.json({ error: 'Business not found' }, { status: 404 });
  }
  return NextResponse.json(business);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const updates = await req.json();
    const updated = appStore.updateBusiness(params.id, updates);
    if (!updated) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const deleted = appStore.deleteBusiness(params.id);
  if (!deleted) {
    return NextResponse.json({ error: 'Business not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true, message: 'Business record deleted' });
}
