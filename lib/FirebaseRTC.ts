/**
 * @link https://webrtc.org/getting-started/firebase-rtc-codelab?hl=ja
 * @link https://github.com/webrtc/FirebaseRTC/tree/solution
 */

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore"; // runs firebase side effects

import * as Admin from "firebase-admin";
import type { ServiceAccount } from "firebase-admin";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_VAPID_KEY,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
};
const serviceAccount = {
    type: process.env.NEXT_PUBLIC_FIREBASE_TYPE,
    project_id: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    private_key_id: process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY
        ? process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
        : undefined,
    client_email: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL,
    client_id: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_ID,
    auth_uri: process.env.NEXT_PUBLIC_FIREBASE_AUTH_URI,
    token_uri: process.env.NEXT_PUBLIC_FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url:
        process.env.NEXT_PUBLIC_FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_X509_CERT_URL,
    universe_domain: process.env.NEXT_PUBLIC_FIREBASE_UNIVERSE_DOMAIN,
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// /*
if (!Admin.apps.length) {
    Admin.initializeApp({
        credential: Admin.credential.cert(serviceAccount as ServiceAccount),
    });
}
// */
// const analytics = getAnalytics(app);

//since we will be interracting with firestore, we
//grab a refference to the firestore database object and export it from this file
// const firestore = getFirestore(app);
const firestore = Admin.firestore();

// FIXME: add case
// connectFirestoreEmulator(firestore, "0.0.0.0", 8080);

/********************
 * WebRTC configs
 ********************/
const webRtcConfiguration = {
    iceServers: [
        {
            // STUN
            urls: [
                "stun:stun1.l.google.com:19302",
                "stun:stun2.l.google.com:19302",
            ],
            // TURN
        },
    ],
    iceCandidatePoolSize: 10,
};
const dataChannelParams = { ordered: false };

export { firestore, webRtcConfiguration, dataChannelParams };
