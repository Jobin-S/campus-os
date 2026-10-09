import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const doc = await adminDb.collection('subjects').doc(id).get();
    if (!doc.exists) {
      return NextResponse.json({ error: 'Subject not found' }, { status: 404 });
    }
    return NextResponse.json(doc.data());
  } catch (error: any) {
    console.error('Firestore subject GET by id error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const updates = await request.json();

    const docRef = adminDb.collection('subjects').doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      return NextResponse.json({ error: 'Subject not found' }, { status: 404 });
    }

    await docRef.update(updates);
    const updated = await docRef.get();
    return NextResponse.json(updated.data());
  } catch (error: any) {
    console.error('Firestore subject PATCH error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  return PATCH(request, { params });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await adminDb.collection('subjects').doc(id).delete();
    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    console.error('Firestore subject DELETE error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
