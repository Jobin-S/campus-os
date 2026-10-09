import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { initialSubjects } from '@/data/mockData';
import { SubjectAttendance } from '@/types';

export async function GET() {
  try {
    const snap = await adminDb.collection('subjects').get();
    if (snap.empty) {
      // Auto seed if empty
      const batch = adminDb.batch();
      for (const item of initialSubjects) {
        batch.set(adminDb.collection('subjects').doc(item.id), item);
      }
      await batch.commit();
      return NextResponse.json(initialSubjects);
    }

    const items = snap.docs.map((doc) => doc.data() as SubjectAttendance);
    return NextResponse.json(items);
  } catch (error: any) {
    console.error('Firestore subjects GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = body.id || `sub-${Date.now()}`;
    const newSubject: SubjectAttendance = {
      ...body,
      id,
      attendedClasses: Number(body.attendedClasses) || 0,
      totalClasses: Number(body.totalClasses) || 0,
      targetPercentage: Number(body.targetPercentage) || 75,
      instructor: body.instructor || 'Department Faculty',
      room: body.room || 'Academic Hall',
      schedule: body.schedule || 'Weekly Lectures',
    };

    await adminDb.collection('subjects').doc(id).set(newSubject);
    return NextResponse.json(newSubject, { status: 201 });
  } catch (error: any) {
    console.error('Firestore subjects POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
