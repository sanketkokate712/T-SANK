"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

export default function UserMenu() {
    const { data: session } = useSession();
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!session?.user) return null;

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setOpen(!open)}
                className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-transparent hover:border-accent-red transition-all duration-300"
                aria-label="User menu"
            >
                {session.user.image ? (
                    <Image
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        fill
                        sizes="32px"
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-accent-red flex items-center justify-center text-white text-xs font-[family-name:var(--font-heading)]">
                        {(session.user.name || "U")[0].toUpperCase()}
                    </div>
                )}
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-full mt-3 w-56 bg-base-dark border border-white/10 rounded-sm shadow-2xl overflow-hidden z-50"
                    >
                        {/* User info */}
                        <div className="p-4 border-b border-white/8">
                            <p className="font-[family-name:var(--font-heading)] text-[11px] tracking-[0.1em] text-white truncate">
                                {session.user.name}
                            </p>
                            <p className="font-[family-name:var(--font-body)] text-[11px] text-text-muted tracking-wider truncate mt-1">
                                {session.user.email}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="p-2">
                            <button
                                onClick={() => signOut()}
                                className="w-full text-left px-3 py-2.5 font-[family-name:var(--font-heading)] text-[10px] tracking-[0.2em] text-text-secondary hover:text-accent-red hover:bg-white/5 transition-all duration-300 rounded-sm"
                            >
                                SIGN OUT
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
