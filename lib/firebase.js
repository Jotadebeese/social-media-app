import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, collection, where, getDocs, query, limit } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyBLdGSFfvXFPPrlZ_AXP-tv9K4o2GISfDo",
    authDomain: "media-app-bd2cf.firebaseapp.com",
    projectId: "media-app-bd2cf",
    storageBucket: "media-app-bd2cf.appspot.com",
    messagingSenderId: "1063892254013",
    appId: "1:1063892254013:web:2a0a9c272dc417dd985954",
    measurementId: "G-GFZR1RXZ1P"
};

function createFirebaseApp(config) {
    try {
      return getApp();
    } catch {
      return initializeApp(config);
    }
  }

const app = createFirebaseApp(firebaseConfig);

export const auth = getAuth(app)
export const googleAuthProvider = new GoogleAuthProvider();
export const firestore = getFirestore(app)
export const storage = getStorage(app)

/**`
 * Gets  a users/{uid} document with username
 * @param {string} username
 */

export async function getUserWithUsername(username) {

  const q = query(
    collection(firestore, 'users'),
    where('username', '==', username),
    limit(1)
  )
  const userDoc = ( await getDocs(q) ).docs[0];
  return userDoc;
}

/**`
 * Converts a firestore document to JSON
 * @param {DocumentSnapshot} doc
 */
export function postToJSON(doc) {
  const data = doc.data();
  return {
    ...data,
    // firestore timestamp is not srializable to JSON. It must be converted to milliseconds
    createdAt: data?.createdAt.toMillis() || 0,
    updatedAt: data?.updatedAt.toMillis() || 0,
  };
}