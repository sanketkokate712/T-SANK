"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFirebaseAuth } from "@/context/FirebaseAuthContext";
import { useToast } from "@/context/ToastContext";

export default function AuthModal() {
    const { authModalOpen, authModalMode, closeAuthModal, signIn, signUp, openAuthModal, resetPassword } = useFirebaseAuth();
    const { showToast } = useToast();

    const [mode, setMode] = useState<"signin" | "signup" | "reset">(authModalMode);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);

    // Sync mode when modal opens
    if (authModalOpen && mode !== authModalMode && mode !== "reset") {
        setMode(authModalMode);
    }

    const reset = () => {
        setName(""); setEmail(""); setPassword(""); setConfirmPassword(""); setLoading(false);
    };

    const handleClose = () => {
        reset();
        closeAuthModal();
    };

    const handleToggleMode = (m: "signin" | "signup") => {
        reset();
        setMode(m);
        openAuthModal(m);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) return;

        if (mode === "signup") {
            if (!name.trim()) { showToast("Please enter your name", "error"); return; }
            if (password !== confirmPassword) { showToast("Passwords do not match", "error"); return; }
            if (password.length < 8) { showToast("Password must be at least 8 characters", "error"); return; }
        }

        setLoading(true);
        try {
            if (mode === "signin") {
                await signIn(email, password);
                showToast("Welcome back! 🔥", "success");
            } else if (mode === "signup") {
                await signUp(name, email, password);
                showToast("Account created! Welcome to T-SANK 🎉", "success");
            }
            reset();
        } catch (err: unknown) {
            const msg = (err as { code?: string })?.code;
            if (msg === "auth/user-not-found" || msg === "auth/wrong-password" || msg === "auth/invalid-credential") {
                showToast("Invalid email or password", "error");
            } else if (msg === "auth/email-already-in-use") {
                showToast("Email already registered. Please sign in.", "error");
            } else if (msg === "auth/too-many-requests") {
                showToast("Too many attempts. Try again later.", "error");
            } else {
                showToast("Something went wrong. Try again.", "error");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) { showToast("Enter your email first", "error"); return; }
        setLoading(true);
        try {
            await resetPassword(email);
            showToast("Password reset email sent! Check your inbox.", "success");
            setMode("signin");
        } catch {
            showToast("Could not send reset email. Check your email address.", "error");
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
                        <div className="bg-[#0d0d0d] border border-white/10 rounded-sm w-full max-w-md pointer-events-auto overflow-hidden shadow-2xl">
                            {/* Header bar */}
                            <div className="h-[2px] bg-gradient-to-r from-accent-red via-accent-red-bright to-transparent" />

                            <div className="p-8">
                                {/* Logo */}
                                <div className="flex items-center gap-2 mb-8">
                                    <div className="relative w-6 h-6 flex items-center justify-center">
                                        <div className="absolute inset-0 border-2 border-accent-red rotate-45" />
                                    </div>
                                    <span className="font-[family-name:var(--font-heading)] text-[13px] tracking-[0.2em] text-white">T-SANK</span>
                                </div>

                                <AnimatePresence mode="wait">
                                    {mode === "reset" ? (
                                        <motion.div key="reset" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                            <h2 className="font-[family-name:var(--font-heading)] text-[18px] tracking-[0.1em] text-white mb-1">RESET PASSWORD</h2>
                                            <p className="font-[family-name:var(--font-body)] text-xs text-white/40 tracking-wider mb-6">
                                                Enter your email and we&apos;ll send a reset link.
                                            </p>
                                            <form onSubmit={handleReset} className="space-y-4">
                                                <div>
                                                    <label className={labelClass}>EMAIL ADDRESS</label>
                                                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" className={inputClass} required />
                                                </div>
                                                <button type="submit" disabled={loading} className="w-full bg-accent-red hover:bg-accent-red-bright disabled:opacity-40 text-white font-[family-name:var(--font-heading)] text-[11px] tracking-[0.25em] py-3.5 transition-all duration-300 hover:shadow-[0_0_30px_rgba(183,28,28,0.5)]">
                                                    {loading ? "SENDING..." : "SEND RESET LINK"}
                                                </button>
                                                <button type="button" onClick={() => setMode("signin")} className="w-full text-white/40 font-[family-name:var(--font-heading)] text-[9px] tracking-[0.2em] py-2 hover:text-white/70 transition-colors">
                                                    ← BACK TO SIGN IN
                                                </button>
                                            </form>
                                        </motion.div>
                                    ) : (
                                        <motion.div key={mode} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                            <h2 className="font-[family-name:var(--font-heading)] text-[18px] tracking-[0.1em] text-white mb-1">
                                                {mode === "signin" ? "WELCOME BACK" : "CREATE ACCOUNT"}
                                            </h2>
                                            <p className="font-[family-name:var(--font-body)] text-xs text-white/40 tracking-wider mb-6">
                                                {mode === "signin" ? "Sign in to access your orders & profile." : "Join T-SANK. Free shipping on first order."}
                                            </p>

                                            <form onSubmit={handleSubmit} className="space-y-4">
                                                {mode === "signup" && (
                                                    <div>
                                                        <label className={labelClass}>YOUR NAME</label>
                                                        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Sanket Kokate" className={inputClass} required />
                                                    </div>
                                                )}
                                                <div>
                                                    <label className={labelClass}>EMAIL ADDRESS</label>
                                                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" className={inputClass} required />
                                                </div>
                                                <div>
                                                    <label className={labelClass}>PASSWORD</label>
                                                    <div className="relative">
                                                        <input type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder={mode === "signup" ? "Min. 8 characters" : "••••••••"} className={inputClass + " pr-12"} required />
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
                                                        <input type={showPass ? "text" : "password"} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Repeat password" className={inputClass} required />
                                                    </div>
                                                )}

                                                {mode === "signin" && (
                                                    <div className="text-right">
                                                        <button type="button" onClick={() => setMode("reset")} className="font-[family-name:var(--font-heading)] text-[9px] tracking-[0.15em] text-accent-red hover:text-accent-red-bright transition-colors">
                                                            FORGOT PASSWORD?
                                                        </button>
                                                    </div>
                                                )}

                                                <button
                                                    type="submit"
                                                    disabled={loading}
                                                    className="w-full bg-accent-red hover:bg-accent-red-bright disabled:opacity-40 disabled:cursor-not-allowed text-white font-[family-name:var(--font-heading)] text-[12px] tracking-[0.25em] py-4 transition-all duration-300 hover:shadow-[0_0_30px_rgba(183,28,28,0.5)] relative overflow-hidden group mt-2"
                                                >
                                                    <span className="relative z-10">
                                                        {loading ? "PLEASE WAIT..." : mode === "signin" ? "SIGN IN" : "CREATE ACCOUNT"}
                                                    </span>
                                                    <div className="absolute inset-0 bg-gradient-to-r from-accent-red-bright to-accent-red opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                                </button>
                                            </form>

                                            {/* Toggle */}
                                            <p className="mt-6 text-center font-[family-name:var(--font-body)] text-[11px] text-white/30 tracking-wider">
                                                {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
                                                <button
                                                    onClick={() => handleToggleMode(mode === "signin" ? "signup" : "signin")}
                                                    className="text-accent-red hover:text-accent-red-bright transition-colors font-[family-name:var(--font-heading)] text-[10px] tracking-[0.1em]"
                                                >
                                                    {mode === "signin" ? "SIGN UP" : "SIGN IN"}
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
