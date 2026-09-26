import { NextRequest, NextResponse } from 'next/server';
import { appStore } from '@/lib/storage/store';
import { CategoryTaxonomy } from '@/types';

export async function GET() {
  const categories = appStore.getCategories();
  return NextResponse.json(categories);
}

export async function POST(req: NextRequest) {
  try {
    const body: CategoryTaxonomy[] = await req.json();
    if (!Array.isArray(body)) {
      return NextResponse.json({ error: 'Categories must be an array' }, { status: 400 });
    }
    appStore.updateCategories(body);
    return NextResponse.json({ success: true, categories: appStore.getCategories() });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to update categories' }, { status: 500 });
  }
}
