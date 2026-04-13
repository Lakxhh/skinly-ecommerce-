// ============================================================
// Skinly Firebase Configuration — skinly-18452
// ============================================================

const firebaseConfig = {
    apiKey: "AIzaSyBZYm2IyoOPGvGeFUL_O6NwlCVzJ5bCxfo",
    authDomain: "skinly-18452.firebaseapp.com",
    projectId: "skinly-18452",
    storageBucket: "skinly-18452.firebasestorage.app",
    messagingSenderId: "128077494246",
    appId: "1:128077494246:web:a529474db18760f1e00827",
    measurementId: "G-32XG3JQ4DY"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

console.log("🌿 Skinly Cloud: Initializing Firebase connection...");

// ============================================================
// Anonymous Sign-In (gives every visitor a unique cloud ID)
// ============================================================
async function handleCloudIdentity() {
    try {
        const user = await auth.signInAnonymously();
        console.log("✅ Skinly Cloud: Connected as", auth.currentUser.uid);
        return auth.currentUser.uid;
    } catch (error) {
        console.error("❌ Firebase Auth Error:", error.code, error.message);
        return null;
    }
}

// ============================================================
// Load Products from Firestore (falls back to data.js)
// ============================================================
// HOW TO ADD PRODUCTS VIA FIREBASE CONSOLE:
//   1. Go to Firestore → 'products' collection
//   2. Each document ID = product ID (e.g., "sp001")
//   3. Fields: name, category, type (skin/hair), desc, price (number),
//              image (URL), ingredients (array), howToUse, rating, reviews,
//              traits (array), filterTarget
//   4. Save. The website auto-loads it on next visit!
// ============================================================
async function loadProductsFromCloud() {
    try {
        const snapshot = await db.collection('products').get();
        if (snapshot.empty) {
            console.log("ℹ️ No cloud products found, using local data.js");
            return null;
        }

        const skinProducts = [];
        const hairProducts = [];

        snapshot.forEach(doc => {
            const p = { id: doc.id, ...doc.data() };
            if (p.type === 'hair') hairProducts.push(p);
            else skinProducts.push(p);
        });

        console.log(`✅ Skinly Cloud: Loaded ${snapshot.size} products from Firestore`);
        return { skin: skinProducts, hair: hairProducts };
    } catch (error) {
        console.warn("⚠️ Cloud product load failed, using local data.js:", error.message);
        return null;
    }
}

// ============================================================
// Save Newsletter Subscription to Firestore
// ============================================================
async function saveNewsletterEmail(email) {
    try {
        await db.collection('newsletter').add({
            email: email,
            subscribedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        console.log("✅ Newsletter email saved:", email);
        return true;
    } catch (error) {
        console.warn("⚠️ Newsletter save failed:", error.message);
        return false;
    }
}
