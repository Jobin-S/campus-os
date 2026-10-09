import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { initialLostFound } from '@/data/mockData';
import { LostFoundItem } from '@/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const zone = searchParams.get('zone');

    const snap = await adminDb.collection('lostFound').get();
    if (snap.empty) {
      // Auto seed if empty
      const batch = adminDb.batch();
      for (const item of initialLostFound) {
        batch.set(adminDb.collection('lostFound').doc(item.id), item);
      }
      await batch.commit();
      return NextResponse.json(initialLostFound);
    }

    let items = snap.docs.map((doc) => doc.data() as LostFoundItem);
    if (type && (type === 'lost' || type === 'found')) {
      items = items.filter((i) => i.type === type);
    }
    if (zone && zone !== 'all') {
      items = items.filter((i) => i.zoneId === zone);
    }

    return NextResponse.json(items);
  } catch (error: any) {
    console.error('Firestore lostFound GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = body.id || `lf-${Date.now()}`;
    const newItem: LostFoundItem = {
      ...body,
      id,
      status: body.status || 'Open',
      claims: body.claims || [],
      dateReported: body.dateReported || new Date().toISOString().split('T')[0],
      timeReported:
        body.timeReported ||
        new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reporterName: body.reporterName || 'Anonymous Campus Student',
      reporterIsAnonymous: body.reporterIsAnonymous || false,
    };

    await adminDb.collection('lostFound').doc(id).set(newItem);
    return NextResponse.json(newItem, { status: 201 });
  } catch (error: any) {
    console.error('Firestore lostFound POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
