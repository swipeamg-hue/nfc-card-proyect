import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

// In-memory analytics store for mock/demo purposes
export const analyticsStore: Array<{
  id: string;
  businessId: string;
  source: string;
  deviceType?: string;
  clickedItem?: string;
  createdAt: string;
}> = [
  { id: '1', businessId: 'biz-nexo-001', source: 'NFC', deviceType: 'MOBILE', clickedItem: 'whatsapp', createdAt: '2026-09-28T10:00:00Z' },
  { id: '2', businessId: 'biz-nexo-001', source: 'NFC', deviceType: 'MOBILE', clickedItem: 'vcard_download', createdAt: '2026-09-28T10:30:00Z' },
  { id: '3', businessId: 'biz-nexo-001', source: 'QR', deviceType: 'MOBILE', clickedItem: 'phone', createdAt: '2026-09-28T11:15:00Z' },
  { id: '4', businessId: 'biz-nexo-001', source: 'NFC', deviceType: 'MOBILE', clickedItem: 'instagram', createdAt: '2026-09-28T12:00:00Z' },
  { id: '5', businessId: 'biz-nexo-001', source: 'DIRECT', deviceType: 'DESKTOP', clickedItem: 'website', createdAt: '2026-09-28T13:20:00Z' },
  { id: '6', businessId: 'biz-nexo-001', source: 'NFC', deviceType: 'MOBILE', clickedItem: 'maps', createdAt: '2026-09-28T14:45:00Z' },
  { id: '7', businessId: 'biz-nexo-001', source: 'QR', deviceType: 'MOBILE', clickedItem: 'whatsapp', createdAt: '2026-09-28T15:10:00Z' },
];

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const metric = {
      id: Math.random().toString(36).substring(2, 9),
      businessId: data.businessId || 'biz-nexo-001',
      source: data.source || 'DIRECT',
      deviceType: data.deviceType || 'MOBILE',
      clickedItem: data.clickedItem || 'view',
      createdAt: new Date().toISOString(),
    };

    analyticsStore.push(metric);

    return NextResponse.json({ success: true, metric });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to record metric' }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({ success: true, count: analyticsStore.length, metrics: analyticsStore });
}
