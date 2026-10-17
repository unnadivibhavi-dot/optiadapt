
import {
  addDoc,
  collection,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";

import { auth, db } from "./firebase";

// Save a new customer case
export const addCustomerCase = async (caseData) => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Please login first.");
  }

  const customerName = caseData.customerName?.trim();

  if (!customerName) {
    throw new Error("Customer name is required.");
  }

  const allowedLensTypes = [
    "Single Vision",
    "Bifocal",
    "PAL",
  ];

  if (!allowedLensTypes.includes(caseData.lensType)) {
    throw new Error("Invalid lens type.");
  }

  const casesRef = collection(
    db,
    "users",
    user.uid,
    "cases"
  );

  const docRef = await addDoc(casesRef, {
    customerName,
    lensType: caseData.lensType,
    status: "Active",
    createdAt: serverTimestamp(),
  });

  return docRef.id;
};

// Get saved customer cases
export const getCustomerCases = async () => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Please login first.");
  }

  const casesRef = collection(
    db,
    "users",
    user.uid,
    "cases"
  );

  const snapshot = await getDocs(casesRef);

  const cases = snapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  }));

  return cases.sort(
    (a, b) =>
      (b.createdAt?.toMillis?.() ?? 0) -
      (a.createdAt?.toMillis?.() ?? 0)
  );
};
