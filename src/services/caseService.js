
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { auth, db } from "./firebase";

const allowedLensTypes = [
  "Single Vision",
  "Bifocal",
  "PAL",
];

// Check logged-in user
const getCurrentUser = () => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Please login first.");
  }

  return user;
};

// Validate customer details
const validateCaseData = (caseData) => {
  const customerName = caseData.customerName?.trim();

  if (!customerName) {
    throw new Error("Customer name is required.");
  }

  if (!allowedLensTypes.includes(caseData.lensType)) {
    throw new Error("Invalid lens type.");
  }

  return {
    customerName,
    lensType: caseData.lensType,
  };
};

// CREATE - Add customer case
export const addCustomerCase = async (caseData) => {
  const user = getCurrentUser();
  const validData = validateCaseData(caseData);

  const casesRef = collection(
    db,
    "users",
    user.uid,
    "cases"
  );

  const docRef = await addDoc(casesRef, {
    ...validData,
    status: "Active",
    createdAt: serverTimestamp(),
  });

  return docRef.id;
};

// READ - Get saved customer cases
export const getCustomerCases = async () => {
  const user = getCurrentUser();

  const casesRef = collection(
    db,
    "users",
    user.uid,
    "cases"
  );

  const snapshot = await getDocs(casesRef);

  const cases = snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));

  return cases.sort(
    (a, b) =>
      (b.createdAt?.toMillis?.() ?? 0) -
      (a.createdAt?.toMillis?.() ?? 0)
  );
};

// UPDATE - Edit customer case
export const updateCustomerCase = async (
  caseId,
  updatedData
) => {
  const user = getCurrentUser();

  if (!caseId || typeof caseId !== "string") {
    throw new Error("Valid customer case ID is required.");
  }

  const validData = validateCaseData(updatedData);

  const caseRef = doc(
    db,
    "users",
    user.uid,
    "cases",
    caseId
  );

  await updateDoc(caseRef, {
    ...validData,
    updatedAt: serverTimestamp(),
  });

  return true;
};

// DELETE - Remove customer case
export const deleteCustomerCase = async (caseId) => {
  const user = getCurrentUser();

  if (!caseId || typeof caseId !== "string") {
    throw new Error("Valid customer case ID is required.");
  }

  const caseRef = doc(
    db,
    "users",
    user.uid,
    "cases",
    caseId
  );

  await deleteDoc(caseRef);

  return true;
};
