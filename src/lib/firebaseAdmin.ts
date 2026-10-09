import { getApps, initializeApp, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import * as fs from 'fs';
import * as path from 'path';

let adminApp: App;
let adminDb: Firestore;

function initFirebaseAdmin() {
  if (getApps().length > 0) {
    adminApp = getApps()[0];
    adminDb = getFirestore(adminApp);
    return { adminApp, adminDb };
  }

  // 1. Check if service-account.json exists in workspace root
  const serviceAccountPath = path.join(process.cwd(), 'service-account.json');
  if (fs.existsSync(serviceAccountPath)) {
    try {
      const fileData = fs.readFileSync(serviceAccountPath, 'utf8');
      const serviceAccount = JSON.parse(fileData);
      adminApp = initializeApp({
        credential: cert(serviceAccount),
        projectId: serviceAccount.project_id || 'campusos-1f58d',
      });
      adminDb = getFirestore(adminApp);
      return { adminApp, adminDb };
    } catch (err) {
      console.warn('Failed to parse service-account.json, trying env vars', err);
    }
  }

  // 2. Fall back to environment variables
  const projectId = process.env.FIREBASE_PROJECT_ID || 'campusos-1f58d';
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (clientEmail && privateKey) {
    privateKey = privateKey.replace(/\\n/g, '\n');
    adminApp = initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
      projectId,
    });
  } else {
    // Fallback: initialize with project ID
    adminApp = initializeApp({ projectId });
  }

  adminDb = getFirestore(adminApp);
  return { adminApp, adminDb };
}

const { adminDb: db, adminApp: app } = initFirebaseAdmin();

export { db as adminDb, app as adminApp };
