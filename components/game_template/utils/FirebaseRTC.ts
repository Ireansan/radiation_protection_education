/**
 * @link https://webrtc.org/getting-started/firebase-rtc-codelab?hl=ja
 * @link https://github.com/webrtc/FirebaseRTC/tree/solution
 * @link https://codesandbox.io/embed/nextjs-webrtc-3kfph?file=/documentation.md&codemirror=1
 */

import { getApps, getApp, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // runs firebase side effects

const firebaseConfig = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    projectId: "nextwebrtc",
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId,
};

//initialize firebase apps if there are no initialized apps
const firebaseApp = !getApps().length
    ? initializeApp(firebaseConfig)
    : getApp();

//since we will be interracting with firestore, we
//grab a refference to the firestore database object and export it from this file
export const firestore = getFirestore(firebaseApp);
