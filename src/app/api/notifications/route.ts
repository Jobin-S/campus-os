import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { initialNotifications } from '@/data/mockData';
import { NotificationItem } from '@/types';

export async function GET() {
  try {
    const snap = await adminDb.collection('notifications').get();
    if (snap.empty) {
      // Auto seed if empty
      const batch = adminDb.batch();
      for (const item of initialNotifications) {
        batch.set(adminDb.collection('notifications').doc(item.id), item);
      }
      await batch.commit();
      return NextResponse.json(initialNotifications);
    }

    const items = snap.docs.map((doc) => doc.data() as NotificationItem);
    return NextResponse.json(items);
  } catch (error: any) {
    console.error('Firestore notifications GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, markAllRead } = body;

    if (markAllRead) {
      const snap = await adminDb.collection('notifications').get();
      const batch = adminDb.batch();
      snap.docs.forEach((doc) => {
        batch.update(doc.ref, { read: true });
      });
      await batch.commit();
      return NextResponse.json({ success: true, message: 'All notifications marked as read' });
    }

    if (id) {
      await adminDb.collection('notifications').doc(id).update({ read: true });
      return NextResponse.json({ success: true, id });
    }

    return NextResponse.json({ error: 'Missing id or markAllRead parameter' }, { status: 400 });
  } catch (error: any) {
    console.error('Firestore notifications PATCH error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
