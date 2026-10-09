import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const action = body.action; // 'attended' | 'missed'

    if (action !== 'attended' && action !== 'missed') {
      return NextResponse.json({ error: "Invalid action. Must be 'attended' or 'missed'" }, { status: 400 });
    }

    const docRef = adminDb.collection('subjects').doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      return NextResponse.json({ error: 'Subject not found' }, { status: 404 });
    }

    const current = doc.data()!;
    const nextTotal = (current.totalClasses || 0) + 1;
    const nextAttended = action === 'attended' ? (current.attendedClasses || 0) + 1 : (current.attendedClasses || 0);

    await docRef.update({
      totalClasses: nextTotal,
      attendedClasses: nextAttended,
    });

    const updated = await docRef.get();
    return NextResponse.json(updated.data());
  } catch (error: any) {
    console.error('Firestore record attendance error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
