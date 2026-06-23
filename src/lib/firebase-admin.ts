import * as admin from 'firebase-admin'

if (!admin.apps.length) {
  const serviceAccountRaw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}'
  let serviceAccount: admin.ServiceAccount | undefined

  try {
    serviceAccount = JSON.parse(serviceAccountRaw)
  } catch {
    // Service account not yet configured — skip init in dev
    serviceAccount = undefined
  }

  if (serviceAccount && Object.keys(serviceAccount).length > 0) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    })
  }
}

// Guard: export null-safe wrappers so the app doesn't crash if Firebase isn't configured yet
export const adminMessaging = admin.apps.length ? admin.messaging() : null
export const adminFirestore = admin.apps.length ? admin.firestore() : null
export default admin
