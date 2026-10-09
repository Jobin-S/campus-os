import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { initialEvents } from '@/data/mockData';
import { CampusEvent } from '@/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const snap = await adminDb.collection('events').get();
    if (snap.empty) {
      // Auto seed if empty
      const batch = adminDb.batch();
      for (const item of initialEvents) {
        batch.set(adminDb.collection('events').doc(item.id), item);
      }
      await batch.commit();
      return NextResponse.json(initialEvents);
    }

    let items = snap.docs.map((doc) => doc.data() as CampusEvent);
    if (category && category !== 'All') {
      items = items.filter((e) => e.category === category);
    }

    return NextResponse.json(items);
  } catch (error: any) {
    console.error('Firestore events GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = body.id || `evt-${Date.now()}`;
    const newEvent: CampusEvent = {
      ...body,
      id,
      isSaved: body.isSaved || false,
      isRegistered: body.isRegistered || false,
      attendeeCount: body.attendeeCount || 1,
      status: body.status || 'Upcoming',
      tags: body.tags || [body.category || 'General'],
      scheduleTimeline: body.scheduleTimeline || [
        { time: body.time || '10:00 AM', activity: 'Event Kickoff' },
      ],
      imageUrl:
        body.imageUrl ||
        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800',
    };

    await adminDb.collection('events').doc(id).set(newEvent);
    return NextResponse.json(newEvent, { status: 201 });
  } catch (error: any) {
    console.error('Firestore events POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
