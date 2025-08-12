import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth';
import { getAnalytics, isSupported as analyticsIsSupported, Analytics } from 'firebase/analytics';

// Firebase configurations for different roles
const getFirebaseConfig = (role?: string) => {
  if (role === 'user') {
    return {
      apiKey: import.meta.env.VITE_USER_FIREBASE_API_KEY || 'AIzaSyAhDSTVQFFiK1wnIlZDeiKymh82WUqZo0I',
      authDomain: import.meta.env.VITE_USER_FIREBASE_AUTH_DOMAIN || 'hackathon-c0118.firebaseapp.com',
      projectId: import.meta.env.VITE_USER_FIREBASE_PROJECT_ID || 'hackathon-c0118',
      appId: import.meta.env.VITE_USER_FIREBASE_APP_ID || '1:456368575764:web:6244a8dad752de83dede01',
      storageBucket: import.meta.env.VITE_USER_FIREBASE_STORAGE_BUCKET || 'hackathon-c0118.firebasestorage.app',
      messagingSenderId: import.meta.env.VITE_USER_FIREBASE_MESSAGING_SENDER_ID || '456368575764',
      measurementId: import.meta.env.VITE_USER_FIREBASE_MEASUREMENT_ID || 'G-JQQS0R96H8',
    };
  }
  
  if (role === 'admin') {
    return {
      apiKey: import.meta.env.VITE_ADMIN_FIREBASE_API_KEY || 'AIzaSyB7nPCX4ycVgbWYbcQhhMq-5tHsqRI6xMk',
      authDomain: import.meta.env.VITE_ADMIN_FIREBASE_AUTH_DOMAIN || 'odoo-admin-2b44b.firebaseapp.com',
      projectId: import.meta.env.VITE_ADMIN_FIREBASE_PROJECT_ID || 'odoo-admin-2b44b',
      appId: import.meta.env.VITE_ADMIN_FIREBASE_APP_ID || '1:646097263518:web:72897407a2727d3f6d948f',
      storageBucket: import.meta.env.VITE_ADMIN_FIREBASE_STORAGE_BUCKET || 'odoo-admin-2b44b.firebasestorage.app',
      messagingSenderId: import.meta.env.VITE_ADMIN_FIREBASE_MESSAGING_SENDER_ID || '646097263518',
      measurementId: import.meta.env.VITE_ADMIN_FIREBASE_MEASUREMENT_ID || 'G-SCCGEBNBCB',
    };
  }
  
  // Default config for owner
  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyBFj6x_elBhkM5KP_DHifcnnQNCsvAQrQY',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'odoo-hackathon-b1baa.firebaseapp.com',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'odoo-hackathon-b1baa',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:749896276494:web:da71bda93ca069d8cc3a5f',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'odoo-hackathon-b1baa.firebasestorage.app',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '749896276494',
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-18Q7K1MYCC',
  };
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let googleProvider: GoogleAuthProvider | null = null;
let analytics: Analytics | null = null;

// Initialize Firebase with role-based configuration
const initializeFirebase = (role: string = 'user') => {
  try {
    const config = getFirebaseConfig(role);
    
    if (!getApps().length) {
      app = initializeApp(config);
    } else {
      app = getApps()[0] || null;
    }
    
    if (app) {
      auth = getAuth(app);
      googleProvider = new GoogleAuthProvider();
      
      // Configure Google OAuth client ID based on role
      if (role === 'user') {
        googleProvider.setCustomParameters({
          client_id: '456368575764-tak55dkgt4emu4tjjag451hl05onvqfd.apps.googleusercontent.com'
        });
      } else if (role === 'admin') {
        googleProvider.setCustomParameters({
          client_id: '646097263518-ogi1ir0drukm7j1ge1l0gs104k610lf7.apps.googleusercontent.com'
        });
      } else {
        // Default for owner
        googleProvider.setCustomParameters({
          client_id: '749896276494-muqlso70r68k24gcr4aesno47u31paap.apps.googleusercontent.com'
        });
      }
      
      // Initialize analytics only in supported/browser environments
      analyticsIsSupported().then((supported) => {
        if (supported) {
          analytics = getAnalytics(app!);
        }
      });
    }
  } catch (e) {
    console.error('Firebase initialization error:', e);
    app = null;
    auth = null;
    googleProvider = null;
    analytics = null;
  }
};

// Initialize with default config (user/owner)
initializeFirebase();

export { app, auth, googleProvider, analytics };

