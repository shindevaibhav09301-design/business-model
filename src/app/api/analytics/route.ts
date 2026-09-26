import { NextRequest, NextResponse } from 'next/server';
import { appStore } from '@/lib/storage/store';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get('city') || undefined;

  const businesses = appStore.getBusinesses(city ? { city } : undefined);
  const total = businesses.length;

  // Category counts
  const categoryCounts: Record<string, number> = {};
  // Website status
  let withWebsite = 0;
  let withoutWebsite = 0;
  let verifiedWebsites = 0;

  // Verification status
  let verified = 0;
  let partiallyVerified = 0;
  let unverified = 0;

  // Confidence
  let highConfidence = 0;
  let mediumConfidence = 0;
  let lowConfidence = 0;

  // Sources
  const sourceContributions: Record<string, number> = {};
  // Areas
  const areaCounts: Record<string, number> = {};

  for (const b of businesses) {
    // Category
    const cat = b.business_category || 'Other';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;

    // Website
    if (b.website) {
      withWebsite++;
      if (b.website_status === 'Verified') verifiedWebsites++;
    } else {
      withoutWebsite++;
    }

    // Verification
    if (b.verification_status === 'Verified') verified++;
    else if (b.verification_status === 'Partially Verified') partiallyVerified++;
    else unverified++;

    // Confidence
    if (b.confidence_level === 'High') highConfidence++;
    else if (b.confidence_level === 'Medium') mediumConfidence++;
    else lowConfidence++;

    // Sources
    for (const src of b.source_names) {
      sourceContributions[src] = (sourceContributions[src] || 0) + 1;
    }

    // Area
    if (b.area) {
      areaCounts[b.area] = (areaCounts[b.area] || 0) + 1;
    }
  }

  // Jobs history summary
  const jobs = appStore.getAllJobs();

  return NextResponse.json({
    total,
    city: city || 'All Cities',
    websiteMetrics: {
      withWebsite,
      withoutWebsite,
      verifiedWebsites,
      withWebsitePercentage: total > 0 ? Math.round((withWebsite / total) * 100) : 0,
      withoutWebsitePercentage: total > 0 ? Math.round((withoutWebsite / total) * 100) : 0,
    },
    verificationMetrics: {
      verified,
      partiallyVerified,
      unverified,
      verifiedPercentage: total > 0 ? Math.round((verified / total) * 100) : 0,
    },
    confidenceMetrics: {
      high: highConfidence,
      medium: mediumConfidence,
      low: lowConfidence,
    },
    categoryCounts,
    sourceContributions,
    topAreas: Object.entries(areaCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([area, count]) => ({ area, count })),
    totalJobsRun: jobs.length,
    recentJobs: jobs.slice(0, 5),
  });
}
