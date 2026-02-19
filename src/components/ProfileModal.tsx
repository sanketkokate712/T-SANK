"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFirebaseAuth } from "@/context/FirebaseAuthContext";
import { useToast } from "@/context/ToastContext";
import { useOrders } from "@/context/OrderContext";
import Image from "next/image";

export default function ProfileModal() {
    const { profileOpen, closeProfile, user, signOut, changePassword } = useFirebaseAuth();
    const { showToast } = useToast();
    const { orders } = useOrders();

    const [tab, setTab] = useState<"info" | "password" | "orders">("info");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);

    const handleSignOut = async () => {
        await signOut();
        closeProfile();
        showToast("Signed out successfully", "success");
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmNewPassword) {
            showToast("New passwords do not match", "error"); return;
        }
        if (newPassword.length < 8) {
            showToast("Password must be at least 8 characters", "error"); return;
        }
        setLoading(true);
        try {
            await changePassword(currentPassword, newPassword);
            showToast("Password updated successfully! 🔐", "success");
            setCurrentPassword(""); setNewPassword(""); setConfirmNewPassword("");
        } catch (err: unknown) {
            const code = (err as { code?: string })?.code;
            if (code === "auth/wrong-password" || code === "auth/invalid-credential") {
                showToast("Current password is incorrect", "error");
            } else {
                showToast("Could not update password. Try again.", "error");
            }
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full bg-neutral-900 border border-white/10 px-4 py-3 text-sm text-white font-[family-name:var(--font-body)] tracking-wider focus:outline-none focus:border-accent-red/60 transition-colors placeholder:text-white/30 rounded-sm";
    const labelClass = "font-[family-name:var(--font-heading)] text-[9px] tracking-[0.25em] text-white/50 block mb-2";
    const tabClass = (active: boolean) =>
        `font-[family-name:var(--font-heading)] text-[9px] tracking-[0.2em] px-4 py-2 transition-all duration-300 ${active ? "text-white border-b-2 border-accent-red" : "text-white/40 hover:text-white/70"}`;

    const statusColor = (s: string) =>
        s === "delivered" ? "text-green-400" : s === "shipped" ? "text-blue-400" : "text-yellow-400";

    const avatar = user?.displayName ? user.displayName[0].toUpperCase() : "U";

    return (
        <AnimatePresence>
            {profileOpen && (
                <>
                    <motion.div
                        key="profile-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200]"
                        onClick={closeProfile}
                    />
                    <motion.div
                        key="profile-modal"
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 30 }}
                        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                        className="fixed inset-0 z-[210] flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className="bg-[#0d0d0d] border border-white/10 rounded-sm w-full max-w-lg max-h-[90vh] flex flex-col pointer-events-auto shadow-2xl">
                            {/* Header bar */}
                            <div className="h-[2px] bg-gradient-to-r from-accent-red via-accent-red-bright to-transparent flex-shrink-0" />

                            {/* User header */}
                            <div className="flex items-center gap-4 p-6 pb-4 border-b border-white/8 flex-shrink-0">
                                {user?.photoURL ? (
                                    <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                                        <Image src={user.photoURL} alt={user.displayName || "User"} fill sizes="48px" className="object-cover" />
                                    </div>
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-accent-red flex items-center justify-center text-white text-lg font-[family-name:var(--font-heading)] flex-shrink-0">
                                        {avatar}
                                    </div>
                                )}
                                <div className="min-w-0 flex-1">
                                    <p className="font-[family-name:var(--font-heading)] text-sm tracking-[0.1em] text-white truncate">
                                        {user?.displayName || "USER"}
                                    </p>
                                    <p className="font-[family-name:var(--font-body)] text-xs text-white/40 tracking-wider truncate mt-0.5">
                                        {user?.email}
                                    </p>
                                </div>
                                <button
                                    onClick={handleSignOut}
                                    className="flex-shrink-0 font-[family-name:var(--font-heading)] text-[9px] tracking-[0.15em] text-white/40 hover:text-accent-red border border-white/10 hover:border-accent-red/40 px-3 py-1.5 transition-all duration-300"
                                >
                                    SIGN OUT
                                </button>
                            </div>

                            {/* Tabs */}
                            <div className="flex border-b border-white/8 flex-shrink-0">
                                <button className={tabClass(tab === "info")} onClick={() => setTab("info")}>PROFILE</button>
                                <button className={tabClass(tab === "password")} onClick={() => setTab("password")}>PASSWORD</button>
                                <button className={tabClass(tab === "orders")} onClick={() => setTab("orders")}>
                                    ORDERS {orders.length > 0 && <span className="ml-1 bg-accent-red text-white text-[8px] px-1.5 py-0.5 rounded-full">{orders.length}</span>}
                                </button>
                            </div>

                            {/* Tab content */}
                            <div className="overflow-y-auto flex-1 custom-scrollbar">
                                <AnimatePresence mode="wait">
                                    {tab === "info" && (
                                        <motion.div key="info" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="p-6 space-y-4">
                                            <div>
                                                <label className={labelClass}>FULL NAME</label>
                                                <div className={inputClass + " opacity-60 cursor-not-allowed"}>{user?.displayName || "—"}</div>
                                            </div>
                                            <div>
                                                <label className={labelClass}>EMAIL ADDRESS</label>
                                                <div className={inputClass + " opacity-60 cursor-not-allowed"}>{user?.email || "—"}</div>
                                            </div>
                                            <div>
                                                <label className={labelClass}>MEMBER SINCE</label>
                                                <div className={inputClass + " opacity-60 cursor-not-allowed"}>T-SANK Member</div>
                                            </div>
                                            <p className="font-[family-name:var(--font-body)] text-[10px] text-white/25 tracking-wider">
                                                To change your name or email, please contact support.
                                            </p>
                                        </motion.div>
                                    )}

                                    {tab === "password" && (
                                        <motion.div key="password" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="p-6">
                                            <form onSubmit={handleChangePassword} className="space-y-4">
                                                <div>
                                                    <label className={labelClass}>CURRENT PASSWORD</label>
                                                    <div className="relative">
                                                        <input
                                                            type={showPass ? "text" : "password"}
                                                            value={currentPassword}
                                                            onChange={e => setCurrentPassword(e.target.value)}
                                                            placeholder="Current password"
                                                            className={inputClass + " pr-12"}
                                                            required
                                                        />
                                                        <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                                {showPass
                                                                    ? <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" /></>
                                                                    : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>
                                                                }
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className={labelClass}>NEW PASSWORD</label>
                                                    <input
                                                        type={showPass ? "text" : "password"}
                                                        value={newPassword}
                                                        onChange={e => setNewPassword(e.target.value)}
                                                        placeholder="Min. 8 characters"
                                                        className={inputClass}
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className={labelClass}>CONFIRM NEW PASSWORD</label>
                                                    <input
                                                        type={showPass ? "text" : "password"}
                                                        value={confirmNewPassword}
                                                        onChange={e => setConfirmNewPassword(e.target.value)}
                                                        placeholder="Repeat new password"
                                                        className={inputClass}
                                                        required
                                                    />
                                                </div>
                                                <button
                                                    type="submit"
                                                    disabled={loading}
                                                    className="w-full bg-accent-red hover:bg-accent-red-bright disabled:opacity-40 text-white font-[family-name:var(--font-heading)] text-[11px] tracking-[0.25em] py-3.5 transition-all duration-300 hover:shadow-[0_0_25px_rgba(183,28,28,0.5)] mt-2"
                                                >
                                                    {loading ? "UPDATING..." : "UPDATE PASSWORD"}
                                                </button>
                                            </form>
                                        </motion.div>
                                    )}

                                    {tab === "orders" && (
                                        <motion.div key="orders" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="p-6 space-y-4">
                                            {orders.length === 0 ? (
                                                <div className="text-center py-12">
                                                    <div className="w-16 h-16 mx-auto border border-white/10 flex items-center justify-center mb-4">
                                                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-white/20">
                                                            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />
                                                        </svg>
                                                    </div>
                                                    <p className="font-[family-name:var(--font-heading)] text-[10px] tracking-[0.2em] text-white/30">NO ORDERS YET</p>
                                                    <p className="font-[family-name:var(--font-body)] text-xs text-white/20 mt-2 tracking-wider">Start shopping to see your orders here.</p>
                                                </div>
                                            ) : (
                                                orders.map(order => (
                                                    <div key={order.id} className="border border-white/8 rounded-sm p-4 space-y-3 bg-white/[0.02]">
                                                        <div className="flex items-center justify-between">
                                                            <span className="font-[family-name:var(--font-heading)] text-[9px] tracking-[0.15em] text-white/50">{order.id}</span>
                                                            <span className={`font-[family-name:var(--font-heading)] text-[9px] tracking-[0.15em] uppercase ${statusColor(order.status)}`}>
                                                                {order.status}
                                                            </span>
                                                        </div>
                                                        <div className="space-y-1">
                                                            {order.items.map((item, i) => (
                                                                <div key={i} className="flex justify-between items-center">
                                                                    <span className="font-[family-name:var(--font-body)] text-xs text-white/70 tracking-wider truncate mr-2">{item.productName} × {item.quantity}</span>
                                                                    <span className="font-[family-name:var(--font-heading)] text-xs text-white flex-shrink-0">₹{item.price * item.quantity}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div className="flex justify-between items-center pt-2 border-t border-white/6">
                                                            <span className="font-[family-name:var(--font-body)] text-[10px] text-white/30 tracking-wider">
                                                                {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                                            </span>
                                                            <span className="font-[family-name:var(--font-heading)] text-sm text-white">₹{order.total}</span>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Close button */}
                        <button
                            onClick={closeProfile}
                            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-white/30 hover:text-white transition-colors"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        </button>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
