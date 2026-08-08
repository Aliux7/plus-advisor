"use server";

import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import {
  doc,
  getFirestore,
  increment,
  updateDoc,
  type Firestore,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function getApp(): FirebaseApp {
  return getApps()[0] ?? initializeApp(firebaseConfig);
}

function getDb(): Firestore {
  return getFirestore(getApp());
}

export async function incrementJournalView(id: string): Promise<void> {
  if (!id) return;
  try {
    await updateDoc(doc(getDb(), "journals", id), {
      views: increment(1),
    });
  } catch (err) {
    console.error("incrementJournalView failed", err);
  }
}
