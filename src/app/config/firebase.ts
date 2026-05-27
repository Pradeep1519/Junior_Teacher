// ============================================
// File 1: teacher-portal/src/app/config/firebase.ts
// ============================================
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut,
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  collection,
  query,
  where,
  getDocs
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA_r7FDkVwHxmtGfrIYtcv8RNXi_PfC2VQ",
  authDomain: "junior-dream.firebaseapp.com",
  projectId: "junior-dream",
  storageBucket: "junior-dream.firebasestorage.app",
  messagingSenderId: "148047251345",
  appId: "1:148047251345:web:b5f4979de57f58f122fc30"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Auth Functions
export const loginWithEmail = async (email: string, password: string) => {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result;
};

export const logoutUser = async () => {
  await signOut(auth);
};

// Firestore Functions
export const getUserData = async (uid: string) => {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    const defaultData = {
      uid: uid,
      name: "Teacher",
      email: "",
      role: "teacher",
      subject: "Multiple Subjects",
      avatar: "TR",
      createdAt: new Date().toISOString()
    };
    await setDoc(docRef, defaultData);
    return defaultData;
  }
};

export const updateUserProfile = async (uid: string, data: any) => {
  await updateDoc(doc(db, "users", uid), {
    ...data,
    updatedAt: new Date().toISOString()
  });
};

// Get students by teacher
export const getTeacherStudents = async (teacherId: string) => {
  const q = query(collection(db, "users"), where("role", "==", "student"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data());
};

// Storage Functions
export const uploadFile = async (path: string, file: File) => {
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  const url = await getDownloadURL(snapshot.ref);
  return url;
};