import { NextRequest, NextResponse } from 'next/server';
import { MAHARASHTRA_DISTRICTS } from '@/lib/data/india-districts';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') || '').trim().toLowerCase();
  const limit = parseInt(searchParams.get('limit') || '40', 10);
  const state = searchParams.get('state');
  const region = searchParams.get('region');

  let results = MAHARASHTRA_DISTRICTS;

  if (state) {
    results = results.filter((d) => d.state.toLowerCase() === state.toLowerCase());
  }

  if (region) {
    results = results.filter((d) => d.region?.toLowerCase() === region.toLowerCase());
  }

  if (q) {
    results = results.filter((d) => {
      const name = d.city.toLowerCase();
      const stateName = d.state.toLowerCase();
      const aliasMatch = d.aliases.some((a) => a.toLowerCase().includes(q));
      return name.includes(q) || stateName.includes(q) || aliasMatch;
    });
  }

  return NextResponse.json({
    total: results.length,
    districts: results.slice(0, limit),
  });
}
