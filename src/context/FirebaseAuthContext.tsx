"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    updatePassword,
    EmailAuthProvider,
    reauthenticateWithCredential,
    updateProfile,
    User,
    sendPasswordResetEmail,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
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
    signUp: (displayName: string, email: string, password: string) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
    changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const googleProvider = new GoogleAuthProvider();

export function FirebaseAuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [authModalMode, setAuthModalMode] = useState<"signin" | "signup">("signin");
    const [profileOpen, setProfileOpen] = useState(false);


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
                // Close modal on successful login
                setAuthModalOpen(false);
            } else {
                setUser(null);
            }
            setLoading(false);
        });
        return () => unsub();
    }, []);



    const openAuthModal = useCallback((mode: "signin" | "signup" = "signin") => {
        setAuthModalMode(mode);
        setAuthModalOpen(true);
    }, []);

    const closeAuthModal = useCallback(() => setAuthModalOpen(false), []);
    const openProfile = useCallback(() => setProfileOpen(true), []);
    const closeProfile = useCallback(() => setProfileOpen(false), []);

    const signIn = useCallback(async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password);
        // Modal will close via onAuthStateChanged
    }, []);

    const signUp = useCallback(async (displayName: string, email: string, password: string) => {
        // Step 1: Create the Firebase Auth account
        const cred = await createUserWithEmailAndPassword(auth, email, password);

        // Step 2: Set display name on the auth user (non-blocking if fails)
        try {
            await updateProfile(cred.user, { displayName });
        } catch {
            // Non-critical — user is still created
        }

        // Step 3: Save to Firestore in the background (don't block on this)
        setDoc(doc(db, "users", cred.user.uid), {
            uid: cred.user.uid,
            displayName,
            email,
            createdAt: serverTimestamp(),
        }).catch(() => {
            // Silent — Firestore save is not critical for auth to work
        });

        // Auth state change (onAuthStateChanged) will close the modal automatically
    }, []);

    const signInWithGoogle = useCallback(async () => {
        await signInWithPopup(auth, googleProvider);
        // Modal closes via onAuthStateChanged
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
                signInWithGoogle,
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
