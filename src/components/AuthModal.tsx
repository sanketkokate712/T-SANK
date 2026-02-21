"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFirebaseAuth } from "@/context/FirebaseAuthContext";
import { useToast } from "@/context/ToastContext";

export default function AuthModal() {
    const {
        authModalOpen, authModalMode, closeAuthModal,
        signIn, signUp, signInWithGoogle, openAuthModal, resetPassword
    } = useFirebaseAuth();
    const { showToast } = useToast();

    const [mode, setMode] = useState<"signin" | "signup" | "reset">(authModalMode);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);

    // Sync mode when authModalMode changes externally
    useEffect(() => {
        if (authModalOpen && mode !== "reset") {
            setMode(authModalMode);
        }
    }, [authModalMode, authModalOpen]);

    // Reset loading state when modal closes (handles the case where auth closes it externally)
    useEffect(() => {
        if (!authModalOpen) {
            setLoading(false);
            setGoogleLoading(false);
        }
    }, [authModalOpen]);

    const resetForm = () => {
        setFullName(""); setEmail(""); setPassword("");
        setConfirmPassword(""); setLoading(false);
    };

    const handleClose = () => {
        resetForm();
        closeAuthModal();
    };

    const handleToggleMode = (m: "signin" | "signup") => {
        resetForm();
        setMode(m);
        openAuthModal(m);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) return;

        if (mode === "signup") {
            if (!fullName.trim()) { showToast("Please enter your name", "error"); return; }
            if (password !== confirmPassword) { showToast("Passwords do not match", "error"); return; }
            if (password.length < 6) { showToast("Password must be at least 6 characters", "error"); return; }
        }

        setLoading(true);
        try {
            if (mode === "signin") {
                await signIn(email, password);
                showToast("Welcome back! 🔥", "success");
            } else if (mode === "signup") {
                await signUp(fullName, email, password);
                showToast(`Welcome to T-SANK, ${fullName.split(" ")[0]}! 🎉`, "success");
            }
            resetForm();
        } catch (err: unknown) {
            const code = (err as { code?: string })?.code;
            if (code === "auth/user-not-found" || code === "auth/wrong-password" || code === "auth/invalid-credential") {
                showToast("Invalid email or password", "error");
            } else if (code === "auth/email-already-in-use") {
                showToast("Email already registered — please sign in", "error");
            } else if (code === "auth/too-many-requests") {
                showToast("Too many attempts. Try again later.", "error");
            } else if (code === "auth/weak-password") {
                showToast("Password is too weak. Use at least 6 characters.", "error");
            } else if (code === "auth/network-request-failed") {
                showToast("Network error. Check your connection.", "error");
            } else {
                showToast("Something went wrong. Try again.", "error");
            }
            setLoading(false); // Only reset on error; success closes modal via auth state
        }
    };

    const handleGoogle = async () => {
        setGoogleLoading(true);
        try {
            await signInWithGoogle();
            showToast("Signed in with Google! 🎉", "success");
        } catch (err: unknown) {
            const code = (err as { code?: string })?.code;
            if (code !== "auth/popup-closed-by-user" && code !== "auth/cancelled-popup-request") {
                showToast("Google sign-in failed. Try again.", "error");
            }
            setGoogleLoading(false);
        }
    };

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) { showToast("Enter your email first", "error"); return; }
        setLoading(true);
        try {
            await resetPassword(email);
            showToast("Reset email sent! Check your inbox.", "success");
            setMode("signin");
        } catch {
            showToast("Could not send reset email. Check the address.", "error");
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full bg-neutral-900 border border-white/10 px-4 py-3 text-sm text-white font-[family-name:var(--font-body)] tracking-wider focus:outline-none focus:border-accent-red/60 transition-colors placeholder:text-white/30 rounded-sm";
    const labelClass = "font-[family-name:var(--font-heading)] text-[9px] tracking-[0.25em] text-white/50 block mb-2";

    return (
        <AnimatePresence>
            {authModalOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="auth-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200]"
                        onClick={handleClose}
                    />

                    {/* Modal */}
                    <motion.div
                        key="auth-modal"
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 30 }}
                        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                        className="fixed inset-0 z-[210] flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className="relative bg-[#0d0d0d] border border-white/10 rounded-sm w-full max-w-md pointer-events-auto overflow-hidden shadow-2xl">
                            {/* Red top bar */}
                            <div className="h-[2px] bg-gradient-to-r from-accent-red via-accent-red-bright to-transparent" />

                            <div className="p-8">
                                {/* Logo */}
                                <div className="flex items-center gap-2 mb-7">
                                    <div className="relative w-6 h-6 flex items-center justify-center flex-shrink-0">
                                        <div className="absolute inset-0 border-2 border-accent-red rotate-45" />
                                    </div>
                                    <span className="font-[family-name:var(--font-heading)] text-[13px] tracking-[0.2em] text-white">T-SANK</span>
                                </div>

                                <AnimatePresence mode="wait">
                                    {mode === "reset" ? (
                                        <motion.div key="reset" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                            <h2 className="font-[family-name:var(--font-heading)] text-lg tracking-[0.1em] text-white mb-1">RESET PASSWORD</h2>
                                            <p className="font-[family-name:var(--font-body)] text-xs text-white/40 tracking-wider mb-6">
                                                Enter your email — we&apos;ll send a reset link.
                                            </p>
                                            <form onSubmit={handleReset} className="space-y-4">
                                                <div>
                                                    <label className={labelClass}>EMAIL ADDRESS</label>
                                                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" className={inputClass} required />
                                                </div>
                                                <button type="submit" disabled={loading} className="w-full bg-accent-red hover:bg-accent-red-bright disabled:opacity-40 text-white font-[family-name:var(--font-heading)] text-[11px] tracking-[0.25em] py-3.5 transition-all duration-300">
                                                    {loading ? "SENDING..." : "SEND RESET LINK"}
                                                </button>
                                                <button type="button" onClick={() => setMode("signin")} className="w-full text-white/40 font-[family-name:var(--font-heading)] text-[9px] tracking-[0.2em] py-2 hover:text-white/60 transition-colors">
                                                    ← BACK TO SIGN IN
                                                </button>
                                            </form>
                                        </motion.div>
                                    ) : (
                                        <motion.div key={mode} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                            <h2 className="font-[family-name:var(--font-heading)] text-lg tracking-[0.1em] text-white mb-1">
                                                {mode === "signin" ? "WELCOME BACK" : "CREATE ACCOUNT"}
                                            </h2>
                                            <p className="font-[family-name:var(--font-body)] text-xs text-white/40 tracking-wider mb-6">
                                                {mode === "signin" ? "Sign in to access your orders & profile." : "Join T-SANK. Premium Transformers merch awaits."}
                                            </p>

                                            {/* Google Button */}
                                            <button
                                                type="button"
                                                onClick={handleGoogle}
                                                disabled={googleLoading || loading}
                                                className="w-full flex items-center justify-center gap-3 border border-white/15 hover:border-white/30 bg-white/[0.03] hover:bg-white/[0.06] text-white font-[family-name:var(--font-heading)] text-[10px] tracking-[0.2em] py-3 transition-all duration-300 rounded-sm mb-4 disabled:opacity-40"
                                            >
                                                {googleLoading ? (
                                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                ) : (
                                                    <svg width="16" height="16" viewBox="0 0 24 24">
                                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                                    </svg>
                                                )}
                                                CONTINUE WITH GOOGLE
                                            </button>

                                            {/* Divider */}
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="flex-1 h-[1px] bg-white/8" />
                                                <span className="font-[family-name:var(--font-body)] text-[10px] text-white/25 tracking-widest">OR</span>
                                                <div className="flex-1 h-[1px] bg-white/8" />
                                            </div>

                                            <form onSubmit={handleSubmit} className="space-y-4">
                                                {mode === "signup" && (
                                                    <div>
                                                        <label className={labelClass}>YOUR NAME</label>
                                                        <input
                                                            type="text"
                                                            value={fullName}
                                                            onChange={e => setFullName(e.target.value)}
                                                            placeholder="Sanket Kokate"
                                                            className={inputClass}
                                                            required
                                                        />
                                                    </div>
                                                )}
                                                <div>
                                                    <label className={labelClass}>EMAIL ADDRESS</label>
                                                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" className={inputClass} required />
                                                </div>
                                                <div>
                                                    <label className={labelClass}>PASSWORD</label>
                                                    <div className="relative">
                                                        <input
                                                            type={showPass ? "text" : "password"}
                                                            value={password}
                                                            onChange={e => setPassword(e.target.value)}
                                                            placeholder={mode === "signup" ? "Min. 6 characters" : "••••••••"}
                                                            className={inputClass + " pr-12"}
                                                            required
                                                        />
                                                        <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                                                            {showPass ? (
                                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" /></svg>
                                                            ) : (
                                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                                {mode === "signup" && (
                                                    <div>
                                                        <label className={labelClass}>CONFIRM PASSWORD</label>
                                                        <input
                                                            type={showPass ? "text" : "password"}
                                                            value={confirmPassword}
                                                            onChange={e => setConfirmPassword(e.target.value)}
                                                            placeholder="Repeat password"
                                                            className={inputClass}
                                                            required
                                                        />
                                                    </div>
                                                )}

                                                {mode === "signin" && (
                                                    <div className="text-right -mt-1">
                                                        <button type="button" onClick={() => setMode("reset")} className="font-[family-name:var(--font-heading)] text-[9px] tracking-[0.15em] text-accent-red hover:text-accent-red-bright transition-colors">
                                                            FORGOT PASSWORD?
                                                        </button>
                                                    </div>
                                                )}

                                                <button
                                                    type="submit"
                                                    disabled={loading || googleLoading}
                                                    className="w-full bg-accent-red hover:bg-accent-red-bright disabled:opacity-40 disabled:cursor-not-allowed text-white font-[family-name:var(--font-heading)] text-[12px] tracking-[0.25em] py-4 transition-all duration-300 hover:shadow-[0_0_30px_rgba(183,28,28,0.5)] relative overflow-hidden group mt-2"
                                                >
                                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                                        {loading && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                                                        {loading
                                                            ? (mode === "signup" ? "CREATING ACCOUNT..." : "SIGNING IN...")
                                                            : (mode === "signin" ? "SIGN IN" : "CREATE ACCOUNT")}
                                                    </span>
                                                    <div className="absolute inset-0 bg-gradient-to-r from-accent-red-bright to-accent-red opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                                </button>
                                            </form>

                                            {/* Toggle */}
                                            <p className="mt-5 text-center font-[family-name:var(--font-body)] text-[11px] text-white/30 tracking-wider">
                                                {mode === "signin" ? "New here? " : "Already have an account? "}
                                                <button
                                                    onClick={() => handleToggleMode(mode === "signin" ? "signup" : "signin")}
                                                    className="text-accent-red hover:text-accent-red-bright transition-colors font-[family-name:var(--font-heading)] text-[10px] tracking-[0.1em]"
                                                >
                                                    {mode === "signin" ? "CREATE ACCOUNT" : "SIGN IN"}
                                                </button>
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Close button */}
                            <button
                                onClick={handleClose}
                                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-white/30 hover:text-white transition-colors"
                                aria-label="Close"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
