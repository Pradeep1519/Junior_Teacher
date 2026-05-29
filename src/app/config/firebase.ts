// ============================================
// UPDATED: teacher-portal/src/app/config/firebase.ts
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

// ✅ FIXED: Get teacher data from BOTH users AND teachers collection
export const getUserData = async (uid: string) => {
  // Pehle users collection check karo
  const userDocRef = doc(db, "users", uid);
  const userDocSnap = await getDoc(userDocRef);
  
  if (userDocSnap.exists()) {
    const userData = userDocSnap.data();
    
    // Agar teacher hai to teachers collection se bhi data lo
    if (userData.role === "teacher") {
      const teacherDocRef = doc(db, "teachers", uid);
      const teacherDocSnap = await getDoc(teacherDocRef);
      if (teacherDocSnap.exists()) {
        return { ...userData, ...teacherDocSnap.data() };
      }
    }
    return userData;
  }
  
  // Agar users mein nahi mila, teachers collection check karo
  const teacherDocRef = doc(db, "teachers", uid);
  const teacherDocSnap = await getDoc(teacherDocRef);
  if (teacherDocSnap.exists()) {
    return teacherDocSnap.data();
  }
  
  // Default teacher data
  const defaultData = {
    uid: uid,
    name: "Teacher",
    email: "",
    role: "teacher",
    subject: "Multiple Subjects",
    avatar: "TR",
    createdAt: new Date().toISOString()
  };
  await setDoc(userDocRef, defaultData);
  return defaultData;
};

export const updateUserProfile = async (uid: string, data: any) => {
  await updateDoc(doc(db, "users", uid), {
    ...data,
    updatedAt: new Date().toISOString()
  });
};

// ✅ FIXED: Get students assigned to THIS teacher from students collection
export const getTeacherStudents = async (teacherId: string) => {
  const q = query(collection(db, "students"), where("assignedTeacherId", "==", teacherId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ studentId: doc.id, ...doc.data() }));
};

// ✅ NEW: Get batches assigned to THIS teacher
export const getTeacherBatches = async (teacherId: string) => {
  const q = query(collection(db, "batches"), where("teachers", "array-contains", teacherId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// ✅ NEW: Get classes for THIS teacher
export const getTeacherClasses = async (teacherId: string) => {
  const q = query(collection(db, "classes"), where("teacherId", "==", teacherId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Storage Functions
export const uploadFile = async (path: string, file: File) => {
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  const url = await getDownloadURL(snapshot.ref);
  return url;
};