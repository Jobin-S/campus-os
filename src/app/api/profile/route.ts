import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { initialUserProfile } from '@/data/mockData';
import { UserProfile } from '@/types';

export async function GET() {
  try {
    const doc = await adminDb.collection('profile').doc('current').get();
    if (!doc.exists) {
      await adminDb.collection('profile').doc('current').set(initialUserProfile);
      return NextResponse.json(initialUserProfile);
    }
    return NextResponse.json(doc.data() as UserProfile);
  } catch (error: any) {
    console.error('Firestore profile GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const updates = await request.json();
    const ref = adminDb.collection('profile').doc('current');
    await ref.set(updates, { merge: true });
    const updated = await ref.get();
    return NextResponse.json(updated.data());
  } catch (error: any) {
    console.error('Firestore profile PATCH error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
