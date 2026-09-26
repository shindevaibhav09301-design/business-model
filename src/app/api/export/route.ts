import { NextRequest, NextResponse } from 'next/server';
import { appStore } from '@/lib/storage/store';
import { BusinessRecord } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { city, category, format = 'csv', selectedFields } = body;

    const businesses = appStore.getBusinesses({
      city: city !== 'All' ? city : undefined,
      category: category !== 'All' ? category : undefined,
    });

    const defaultFields = [
      'business_name',
      'business_category',
      'business_subcategory',
      'address',
      'city',
      'state',
      'phone_numbers',
      'email_addresses',
      'website',
      'rating',
      'review_count',
      'verification_status',
      'data_confidence',
      'courses',
      'services',
      'last_verified_at',
    ];

    const fields: string[] = selectedFields && selectedFields.length > 0 ? selectedFields : defaultFields;

    if (format === 'json') {
      const filteredRecords = businesses.map((b) => {
        const item: Record<string, any> = {};
        for (const f of fields) {
          item[f] = (b as any)[f] ?? 'Not Available';
        }
        return item;
      });

      return new NextResponse(JSON.stringify(filteredRecords, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="local_intelligence_${(city || 'all').toLowerCase()}_${Date.now()}.json"`,
        },
      });
    }

    // CSV format
    const escapeCsv = (val: any) => {
      if (val === null || val === undefined) return '""';
      if (Array.isArray(val)) {
        val = val.join('; ');
      }
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const headerLine = fields.map((f) => `"${f.replace(/_/g, ' ').toUpperCase()}"`).join(',');
    const rows = businesses.map((b) => {
      return fields.map((f) => escapeCsv((b as any)[f])).join(',');
    });

    const csvContent = [headerLine, ...rows].join('\r\n');

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="local_intelligence_${(city || 'all').toLowerCase()}_${Date.now()}.csv"`,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Export failed' }, { status: 500 });
  }
}
