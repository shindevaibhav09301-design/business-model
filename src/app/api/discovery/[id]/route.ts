import { NextRequest, NextResponse } from 'next/server';
import { appStore } from '@/lib/storage/store';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const job = appStore.getDiscoveryJob(params.id);
  if (!job) {
    return NextResponse.json({ error: 'Discovery job not found' }, { status: 404 });
  }
  return NextResponse.json(job);
}
