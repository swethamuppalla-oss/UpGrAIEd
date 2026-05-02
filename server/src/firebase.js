import admin from 'firebase-admin';
import { createRequire } from 'module';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let credential;

if (process.env.FIREBASE_PROJECT_ID) {
  // Production: credentials from env vars (Render, Vercel, etc.)
  credential = admin.credential.cert({
    projectId:   process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey:  process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  });
} else {
  // Local dev: service account JSON file
  const keyPath = path.resolve(__dirname, '../../serviceAccountKey.json');
  if (!existsSync(keyPath)) {
    throw new Error(
      'Firebase not configured. Set FIREBASE_PROJECT_ID env vars or add serviceAccountKey.json to the server root.'
    );
  }
  const require = createRequire(import.meta.url);
  credential = admin.credential.cert(require(keyPath));
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

export const db = admin.firestore();
export const bucket = admin.storage().bucket();
