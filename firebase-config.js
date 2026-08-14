// Firebase Real-Time Cloud Synchronization Configuration for Abhishek Hingmire Portfolio
(function () {
  'use strict';

  // Default Firebase configuration (can be updated from Admin Dashboard -> Settings)
  const DEFAULT_FIREBASE_CONFIG = {
    apiKey: "AIzaSyDbrUuwb5vKR4WqiGXfDavhOBCnKf3ZiAE",
    authDomain: "abhishek-portfolio-8f2d1.firebaseapp.com",
    projectId: "abhishek-portfolio-8f2d1",
    storageBucket: "abhishek-portfolio-8f2d1.firebasestorage.app",
    messagingSenderId: "417150384879",
    appId: "1:417150384879:web:5d62b2136a6c20fe2ff91a"
  };

  function getFirebaseConfig() {
    try {
      const stored = localStorage.getItem('firebase_config');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.projectId && parsed.apiKey) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read firebase_config from localStorage:', e);
    }
    return DEFAULT_FIREBASE_CONFIG;
  }

  let db = null;
  let isInitialized = false;

  function initFirebase() {
    if (isInitialized && db) return db;
    const config = getFirebaseConfig();
    if (!config || !config.apiKey || !config.projectId) {
      return null;
    }

    try {
      if (typeof firebase !== 'undefined') {
        if (!firebase.apps.length) {
          firebase.initializeApp(config);
        }
        db = firebase.firestore();
        isInitialized = true;
        return db;
      }
    } catch (err) {
      console.warn('Firebase initialization error:', err);
    }
    return null;
  }

  // Check if Cloud Sync is active
  window.isFirebaseConfigured = function () {
    const config = getFirebaseConfig();
    return Boolean(config && config.apiKey && config.projectId);
  };

  // Fetch portfolio data from Cloud Firestore
  window.fetchCloudPortfolio = async function () {
    const firestore = initFirebase();
    if (!firestore) return null;

    try {
      const docRef = firestore.collection('portfolios').doc('abhishek_data');
      const docSnap = await docRef.get();
      if (docSnap.exists) {
        const cloudData = docSnap.data();
        if (cloudData && typeof cloudData === 'object') {
          return cloudData;
        }
      }
    } catch (error) {
      console.warn('Error fetching cloud data from Firestore:', error);
    }
    return null;
  };

  // Save portfolio data to Cloud Firestore
  window.saveCloudPortfolio = async function (data) {
    const firestore = initFirebase();
    if (!firestore) {
      return { success: false, error: 'Firebase is not configured yet. Saving to local storage only.' };
    }

    try {
      const docRef = firestore.collection('portfolios').doc('abhishek_data');
      await docRef.set(data, { merge: true });
      return { success: true };
    } catch (error) {
      console.error('Error saving data to Cloud Firestore:', error);
      return { success: false, error: error.message };
    }
  };

  // Save Firebase Config from Admin
  window.setFirebaseConfig = function (newConfig) {
    if (newConfig && typeof newConfig === 'object') {
      localStorage.setItem('firebase_config', JSON.stringify(newConfig));
      isInitialized = false;
      db = null;
      return initFirebase();
    }
  };

  window.getFirebaseConfig = getFirebaseConfig;

  // Initialize on script load if configured
  initFirebase();
})();
