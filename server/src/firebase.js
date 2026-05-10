import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getStorage } from 'firebase-admin/storage'

let bucket = null

const {
  FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY,
  FIREBASE_STORAGE_BUCKET,
} = process.env

if (FIREBASE_PROJECT_ID && FIREBASE_CLIENT_EMAIL && FIREBASE_PRIVATE_KEY && FIREBASE_STORAGE_BUCKET) {
  try {
    const app = getApps().length === 0
      ? initializeApp({
          credential: cert({
            projectId: FIREBASE_PROJECT_ID,
            clientEmail: FIREBASE_CLIENT_EMAIL,
            privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          }),
          storageBucket: FIREBASE_STORAGE_BUCKET,
        })
      : getApps()[0]

    bucket = getStorage(app).bucket()
    console.log('[Firebase] Storage initialised ✓')
  } catch (err) {
    console.warn('[Firebase] Init failed — falling back to local disk storage:', err.message)
  }
} else {
  console.log('[Firebase] No credentials in env — using local disk storage')
}

export { bucket }
