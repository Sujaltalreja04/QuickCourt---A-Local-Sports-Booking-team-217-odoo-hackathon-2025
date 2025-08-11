import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth';
import { getAnalytics, isSupported as analyticsIsSupported, Analytics } from 'firebase/analytics';

// Prefer Vite env vars, fallback to provided config
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDuHsueSwFPhrKT5kAue2tBVwbM6TlBNNo';
const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'sport-booking-32773.firebaseapp.com';
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID || 'sport-booking-32773';
const appId = import.meta.env.VITE_FIREBASE_APP_ID || '1:220598503396:web:55b7888e784eedd5ffe9f1';
const storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'sport-booking-32773.firebasestorage.app';
const messagingSenderId = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '220598503396';
const measurementId = import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-91TNHN6LB8';

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let googleProvider: GoogleAuthProvider | null = null;
let analytics: Analytics | null = null;

try {
  if (!getApps().length) {
    app = initializeApp({
      apiKey,
      authDomain,
      projectId,
      appId,
      storageBucket,
      messagingSenderId,
      measurementId,
    });
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
  } else {
    app = getApps()[0] || null;
    if (app) {
      auth = getAuth(app);
      googleProvider = new GoogleAuthProvider();
    }
  }
  // Initialize analytics only in supported/browser environments
  if (app) {
    analyticsIsSupported().then((supported) => {
      if (supported) {
        analytics = getAnalytics(app!);
      }
    });
  }
} catch (e) {
  // Silently ignore init errors to prevent breaking the app if env is missing
  app = null;
  auth = null;
  googleProvider = null;
  analytics = null;
}

export { app, auth, googleProvider, analytics };

