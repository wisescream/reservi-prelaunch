import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { AdminUser, AdminContextType } from "../types/admin";
import { loginAdmin, logoutAdmin, getAdminUser, verifyAdminAccess } from "./auth";

const AdminContext = createContext<AdminContextType | undefined>(undefined);

/**
 * Admin Context Provider
 */
export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      try {
        if (firebaseUser) {
          // Check if user is admin
          const isAdmin = await verifyAdminAccess(firebaseUser.uid);
          if (isAdmin) {
            const adminUser = await getAdminUser(firebaseUser.uid);
            setUser(adminUser);
          } else {
            // User authenticated but not admin
            setUser(null);
            await logoutAdmin();
          }
        } else {
          setUser(null);
        }
        setError(null);
      } catch (err) {
        console.error("Error verifying admin access:", err);
        setError("Failed to verify admin access");
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const firebaseUser = await loginAdmin(email, password);

      // Verify admin role
      const isAdmin = await verifyAdminAccess(firebaseUser.uid);
      if (!isAdmin) {
        await logoutAdmin();
        throw new Error("You do not have admin access");
      }

      const adminUser = await getAdminUser(firebaseUser.uid);
      if (adminUser) {
        setUser(adminUser);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      setError(errorMessage);
      setUser(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      await logoutAdmin();
      setUser(null);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Logout failed";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const checkAdminRole = async (uid: string): Promise<boolean> => {
    return verifyAdminAccess(uid);
  };

  const value: AdminContextType = {
    user,
    loading,
    error,
    isAdmin: user !== null,
    login,
    logout,
    checkAdminRole,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

/**
 * Hook to use admin context
 */
export function useAdmin(): AdminContextType {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within AdminProvider");
  }
  return context;
}
