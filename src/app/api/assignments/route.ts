import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { initialAssignments } from '@/data/mockData';
import { Assignment } from '@/types';

export async function GET() {
  try {
    const snap = await adminDb.collection('assignments').get();
    if (snap.empty) {
      // Auto seed if empty
      const batch = adminDb.batch();
      for (const item of initialAssignments) {
        batch.set(adminDb.collection('assignments').doc(item.id), item);
      }
      await batch.commit();
      return NextResponse.json(initialAssignments);
    }

    const items = snap.docs.map((doc) => doc.data() as Assignment);
    return NextResponse.json(items);
  } catch (error: any) {
    console.error('Firestore assignments GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = body.id || `asg-${Date.now()}`;
    const newAssignment: Assignment = {
      ...body,
      id,
      createdAt: body.createdAt || new Date().toISOString().split('T')[0],
      checklist: body.checklist || [],
      attachments: body.attachments || [],
      reminders: body.reminders || { days3: true, days1: true, dayOf: true },
      status: body.status || 'pending',
      progress: body.progress || 0,
    };

    await adminDb.collection('assignments').doc(id).set(newAssignment);
    return NextResponse.json(newAssignment, { status: 201 });
  } catch (error: any) {
    console.error('Firestore assignments POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
