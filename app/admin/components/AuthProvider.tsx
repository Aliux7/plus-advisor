"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as fbSignOut,
  type User,
} from "firebase/auth";
import { getFirebaseAuth, googleProvider } from "../lib/firebase";
import { isEmailWhitelisted } from "../lib/whitelist";

type AuthState = {
  user: User | null;
  loading: boolean;
  authError: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}

const LOGIN_PATH = "/admin/login";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const auth = getFirebaseAuth();
    return onAuthStateChanged(auth, async (u) => {
      if (!u) {
        setUser(null);
        setLoading(false);
        return;
      }

      const email = u.email ?? "";
      try {
        const allowed = await isEmailWhitelisted(email);
        if (!allowed) {
          await fbSignOut(auth);
          setUser(null);
          setAuthError(
            `${email || "This account"} is not authorized to access the admin.`,
          );
        } else {
          setUser(u);
          setAuthError(null);
        }
      } catch (e) {
        await fbSignOut(auth);
        setUser(null);
        setAuthError(
          e instanceof Error
            ? `Whitelist check failed: ${e.message}`
            : "Whitelist check failed.",
        );
      } finally {
        setLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    if (loading) return;
    const onLoginPage = pathname === LOGIN_PATH;
    if (!user && !onLoginPage) {
      router.replace(LOGIN_PATH);
    } else if (user && onLoginPage) {
      router.replace("/admin");
    }
  }, [user, loading, pathname, router]);

  const signInWithGoogle = useCallback(async () => {
    setAuthError(null);
    await signInWithPopup(getFirebaseAuth(), googleProvider);
  }, []);

  const signOut = useCallback(async () => {
    await fbSignOut(getFirebaseAuth());
  }, []);

  const value = useMemo<AuthState>(
    () => ({ user, loading, authError, signInWithGoogle, signOut }),
    [user, loading, authError, signInWithGoogle, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
