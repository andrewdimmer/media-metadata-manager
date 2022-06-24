import * as admin from "firebase-admin";

// Initialize Firebase
const firebaseApp = admin.initializeApp();

// Configure the hackathon-specific directory for Firestore
export const firebaseFirestore = firebaseApp
  .firestore()
  .collection("hackathons")
  .doc("FreyHacks2022");
