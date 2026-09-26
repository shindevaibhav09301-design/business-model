import { NextRequest, NextResponse } from 'next/server';
import { appStore } from '@/lib/storage/store';

export async function GET() {
  const settings = appStore.getAdminSettings();
  const duplicateCandidates = appStore.getDuplicateCandidates();
  const jobs = appStore.getAllJobs();

  return NextResponse.json({
    settings,
    duplicateCandidates,
    jobsCount: jobs.length,
    totalBusinesses: appStore.getBusinesses().length,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const updated = appStore.updateAdminSettings(body);
    return NextResponse.json({ success: true, settings: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to update settings' }, { status: 500 });
  }
}
