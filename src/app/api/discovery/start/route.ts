import { NextRequest, NextResponse } from 'next/server';
import { DiscoveryOrchestrator } from '@/lib/discovery/engine/orchestrator';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const city = (body.city || '').trim();

    if (!city) {
      return NextResponse.json({ error: 'City name is required' }, { status: 400 });
    }

    const cleanCityCode = city.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4) || 'CITY';
    const timestamp = Date.now().toString().slice(-4);
    const jobId = `JOB-${cleanCityCode}-2026-${timestamp}`;

    const options = {
      city,
      country: body.country || 'India',
      state: body.state,
      categories: body.categories,
      maxResults: body.maxResults || 50,
      searchDepth: body.searchDepth || 2,
      includeWebsites: body.includeWebsites ?? true,
      includeSocialProfiles: body.includeSocialProfiles ?? true,
      includeReviews: body.includeReviews ?? true,
      includeContactInfo: body.includeContactInfo ?? true,
    };

    // Run discovery asynchronously in background
    DiscoveryOrchestrator.runJob(jobId, options).catch((err) => {
      console.error(`Discovery error in background for ${jobId}:`, err);
    });

    return NextResponse.json({
      success: true,
      jobId,
      message: `Discovery initiated for ${city}`,
      city,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to start discovery' }, { status: 500 });
  }
}
