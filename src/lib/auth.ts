import {
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "./firebase";
import { AdminUser, UserRole } from "../types/admin";

/**
 * Sign in admin user with email and password
 */
export async function loginAdmin(email: string, password: string): Promise<User> {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

/**
 * Sign out current user
 */
export async function logoutAdmin(): Promise<void> {
  await signOut(auth);
}

/**
 * Check if user is admin by verifying role in Firestore
 */
export async function isUserAdmin(uid: string): Promise<boolean> {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      const role = userDoc.data()?.role;
      return role === "admin";
    }
    return false;
  } catch (error) {
    console.error("Error checking admin role:", error);
    return false;
  }
}

/**
 * Get admin user data from Firestore
 */
export async function getAdminUser(uid: string): Promise<AdminUser | null> {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      const data = userDoc.data();
      if (data.role === "admin") {
        return {
          uid,
          email: data.email,
          role: data.role as UserRole,
          createdAt: data.createdAt?.toDate() || new Date(),
        };
      }
    }
    return null;
  } catch (error) {
    console.error("Error fetching admin user:", error);
    return null;
  }
}

/**
 * Create admin user in Firestore (for setup only - should be done via Firestore console)
 */
export async function createAdminUser(uid: string, email: string): Promise<void> {
  try {
    await getDoc(doc(db, "users", uid));
    // In production, only admin console should create admins
    console.warn("Admin creation should be handled via Firestore console");
  } catch (error) {
    console.error("Error creating admin user:", error);
    throw error;
  }
}

/**
 * Get all admin emails for whitelist validation
 */
export async function getAdminEmails(): Promise<string[]> {
  try {
    const q = query(collection(db, "users"), where("role", "==", "admin"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data().email);
  } catch (error) {
    console.error("Error fetching admin emails:", error);
    return [];
  }
}

/**
 * Verify admin access (combined check)
 */
export async function verifyAdminAccess(uid: string): Promise<boolean> {
  return isUserAdmin(uid);
}
