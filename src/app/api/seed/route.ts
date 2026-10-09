import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import {
  initialAssignments,
  initialSubjects,
  initialEvents,
  initialLostFound,
  initialNotifications,
  initialClasses,
  initialUserProfile,
} from '@/data/mockData';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const force = searchParams.get('force') === 'true';

    // Check if already seeded
    const assignmentsSnap = await adminDb.collection('assignments').limit(1).get();
    if (!assignmentsSnap.empty && !force) {
      return NextResponse.json({
        message: 'Database is already seeded with CampusOS collections.',
        status: 'ready',
      });
    }

    const batch = adminDb.batch();

    // 1. Assignments
    for (const item of initialAssignments) {
      const ref = adminDb.collection('assignments').doc(item.id);
      batch.set(ref, item);
    }

    // 2. Subjects
    for (const item of initialSubjects) {
      const ref = adminDb.collection('subjects').doc(item.id);
      batch.set(ref, item);
    }

    // 3. Events
    for (const item of initialEvents) {
      const ref = adminDb.collection('events').doc(item.id);
      batch.set(ref, item);
    }

    // 4. Lost & Found
    for (const item of initialLostFound) {
      const ref = adminDb.collection('lostFound').doc(item.id);
      batch.set(ref, item);
    }

    // 5. Notifications
    for (const item of initialNotifications) {
      const ref = adminDb.collection('notifications').doc(item.id);
      batch.set(ref, item);
    }

    // 6. Schedule Classes
    for (const item of initialClasses) {
      const ref = adminDb.collection('classes').doc(item.id);
      batch.set(ref, item);
    }

    // 7. Profile
    const profileRef = adminDb.collection('profile').doc('current');
    batch.set(profileRef, initialUserProfile);

    await batch.commit();

    return NextResponse.json({
      success: true,
      message: 'Firestore successfully populated with CampusOS collections!',
      counts: {
        assignments: initialAssignments.length,
        subjects: initialSubjects.length,
        events: initialEvents.length,
        lostFound: initialLostFound.length,
        notifications: initialNotifications.length,
        classes: initialClasses.length,
      },
    });
  } catch (error: any) {
    console.error('Error seeding Firestore database:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Unknown database error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  return GET(request);
}
