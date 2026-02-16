"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Toast {
    id: string;
    message: string;
    type: "success" | "error" | "info";
}

interface ToastContextType {
    showToast: (message: string, type?: "success" | "error" | "info") => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback(
        (message: string, type: "success" | "error" | "info" = "success") => {
            const id = Date.now().toString() + Math.random().toString(36).slice(2);
            setToasts((prev) => [...prev, { id, message, type }]);
            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== id));
            }, 3000);
        },
        []
    );

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {/* Toast container */}
            <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, y: 30, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.9 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className={`pointer-events-auto px-5 py-3 rounded-sm backdrop-blur-xl border text-sm font-[family-name:var(--font-body)] tracking-wider shadow-2xl ${toast.type === "success"
                                    ? "bg-green-500/15 border-green-500/30 text-green-400"
                                    : toast.type === "error"
                                        ? "bg-red-500/15 border-red-500/30 text-red-400"
                                        : "bg-blue-500/15 border-blue-500/30 text-blue-400"
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <span>
                                    {toast.type === "success"
                                        ? "✓"
                                        : toast.type === "error"
                                            ? "✕"
                                            : "ℹ"}
                                </span>
                                <span>{toast.message}</span>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}
