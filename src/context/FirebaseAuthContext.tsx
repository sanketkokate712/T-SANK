"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    updatePassword,
    EmailAuthProvider,
    reauthenticateWithCredential,
    updateProfile,
    User,
    sendPasswordResetEmail,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

interface FirebaseUser {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
}

interface AuthContextType {
    user: FirebaseUser | null;
    loading: boolean;
    // Auth modal state
    authModalOpen: boolean;
    authModalMode: "signin" | "signup";
    openAuthModal: (mode?: "signin" | "signup") => void;
    closeAuthModal: () => void;
    // Profile modal state
    profileOpen: boolean;
    openProfile: () => void;
    closeProfile: () => void;
    // Auth actions
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (name: string, email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function FirebaseAuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [authModalMode, setAuthModalMode] = useState<"signin" | "signup">("signin");
    const [profileOpen, setProfileOpen] = useState(false);
    const [hasShownWelcome, setHasShownWelcome] = useState(false);

    // Listen to Firebase auth state
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (firebaseUser: User | null) => {
            if (firebaseUser) {
                setUser({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    displayName: firebaseUser.displayName,
                    photoURL: firebaseUser.photoURL,
                });
            } else {
                setUser(null);
            }
            setLoading(false);
        });
        return () => unsub();
    }, []);

    // Show sign-in popup on first visit (after load, if not signed in)
    useEffect(() => {
        if (!loading && !user && !hasShownWelcome) {
            const timer = setTimeout(() => {
                setHasShownWelcome(true);
                setAuthModalOpen(true);
                setAuthModalMode("signin");
            }, 1500);
            return () => clearTimeout(timer);
        }
        if (user) setHasShownWelcome(true);
    }, [loading, user, hasShownWelcome]);

    const openAuthModal = useCallback((mode: "signin" | "signup" = "signin") => {
        setAuthModalMode(mode);
        setAuthModalOpen(true);
    }, []);

    const closeAuthModal = useCallback(() => setAuthModalOpen(false), []);
    const openProfile = useCallback(() => setProfileOpen(true), []);
    const closeProfile = useCallback(() => setProfileOpen(false), []);

    const signIn = useCallback(async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password);
        setAuthModalOpen(false);
    }, []);

    const signUp = useCallback(async (name: string, email: string, password: string) => {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        // Set display name
        await updateProfile(cred.user, { displayName: name });
        // Save user profile to Firestore
        await setDoc(doc(db, "users", cred.user.uid), {
            uid: cred.user.uid,
            displayName: name,
            email,
            createdAt: serverTimestamp(),
        });
        setAuthModalOpen(false);
    }, []);

    const signOut = useCallback(async () => {
        await firebaseSignOut(auth);
    }, []);

    const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
        if (!auth.currentUser || !auth.currentUser.email) throw new Error("Not authenticated");
        const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
        await reauthenticateWithCredential(auth.currentUser, credential);
        await updatePassword(auth.currentUser, newPassword);
    }, []);

    const resetPassword = useCallback(async (email: string) => {
        await sendPasswordResetEmail(auth, email);
    }, []);

    // Sync displayName from Firestore on login
    useEffect(() => {
        const fetchProfile = async () => {
            if (!auth.currentUser) return;
            try {
                const snap = await getDoc(doc(db, "users", auth.currentUser.uid));
                if (snap.exists() && auth.currentUser.displayName === null) {
                    const data = snap.data();
                    if (data.displayName) {
                        await updateProfile(auth.currentUser, { displayName: data.displayName });
                        setUser(prev => prev ? { ...prev, displayName: data.displayName } : prev);
                    }
                }
            } catch {
                // silent
            }
        };
        if (user) fetchProfile();
    }, [user?.uid]);

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                authModalOpen,
                authModalMode,
                openAuthModal,
                closeAuthModal,
                profileOpen,
                openProfile,
                closeProfile,
                signIn,
                signUp,
                signOut,
                changePassword,
                resetPassword,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useFirebaseAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useFirebaseAuth must be used within FirebaseAuthProvider");
    return ctx;
}
