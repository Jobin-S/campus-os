import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { initialClasses } from '@/data/mockData';
import { ClassScheduleItem } from '@/types';

export async function GET() {
  try {
    const snap = await adminDb.collection('classes').get();
    if (snap.empty) {
      const batch = adminDb.batch();
      for (const item of initialClasses) {
        batch.set(adminDb.collection('classes').doc(item.id), item);
      }
      await batch.commit();
      return NextResponse.json(initialClasses);
    }

    const items = snap.docs.map((doc) => doc.data() as ClassScheduleItem);
    return NextResponse.json(items);
  } catch (error: any) {
    console.error('Firestore classes GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
