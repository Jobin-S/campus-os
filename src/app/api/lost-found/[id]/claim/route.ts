import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { claimantName, details } = body;

    if (!claimDetailsValid(details)) {
      return NextResponse.json({ error: 'Ownership verification details are required' }, { status: 400 });
    }

    const docRef = adminDb.collection('lostFound').doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    const current = doc.data()!;
    const newClaim = {
      id: `cl-${Date.now()}`,
      claimantName: claimantName || 'Anonymous Student',
      details,
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
    };

    const updatedClaims = [...(current.claims || []), newClaim];

    await docRef.update({
      status: 'Claim Pending',
      claims: updatedClaims,
    });

    const updated = await docRef.get();
    return NextResponse.json(updated.data());
  } catch (error: any) {
    console.error('Firestore submit claim error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function claimDetailsValid(details?: string): boolean {
  return typeof details === 'string' && details.trim().length > 0;
}
