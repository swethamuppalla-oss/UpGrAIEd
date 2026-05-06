import admin from 'firebase-admin';
import { createRequire } from 'module';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let credential = null;

if (process.env.FIREBASE_PROJECT_ID) {
  credential = admin.credential.cert({
    projectId:   process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey:  process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  });
} else {
  const keyPath = path.resolve(__dirname, '../../serviceAccountKey.json');
  if (existsSync(keyPath)) {
    const require = createRequire(import.meta.url);
    credential = admin.credential.cert(require(keyPath));
  }
}

let db = null;
let bucket = null;

if (credential) {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
  }
  db = admin.firestore();
  bucket = admin.storage().bucket();
} else {
  console.warn('[Firebase] No credentials found — storage and Firestore disabled. Add serviceAccountKey.json or set FIREBASE_PROJECT_ID env vars to enable.');
}

export { db, bucket };
