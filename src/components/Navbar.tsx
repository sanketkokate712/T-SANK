"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_LINKS, STORE } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useFirebaseAuth } from "@/context/FirebaseAuthContext";
import UserMenu from "@/components/UserMenu";
import SearchOverlay from "@/components/SearchOverlay";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [lastY, setLastY] = useState(0);
    const { toggleCart, totalItems } = useCart();
    const { user, openAuthModal } = useFirebaseAuth();

    // Auto-hide on scroll down, show on scroll up
    useEffect(() => {
        const onScroll = () => {
            const y = window.scrollY;
            setHidden(y > 100 && y > lastY);
            setScrolled(y > 60);
            setLastY(y);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, [lastY]);

    // Lock body when mobile menu is open
    useEffect(() => {
        document.body.style.overflow = menuOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [menuOpen]);

    const closeMenu = useCallback(() => setMenuOpen(false), []);

    // Mobile menu item stagger variants
    const menuVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.06, delayChildren: 0.1 },
        },
        exit: {
            opacity: 0,
            transition: { staggerChildren: 0.03, staggerDirection: -1 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -30 },
        visible: { opacity: 1, x: 0, transition: { ease: [0.16, 1, 0.3, 1] as [number, number, number, number], duration: 0.5 } },
        exit: { opacity: 0, x: 30, transition: { duration: 0.2 } },
    };

    return (
        <>
            <motion.nav
                className="fixed top-0 left-0 right-0 z-50"
                initial={{ y: -80 }}
                animate={{ y: hidden && !menuOpen ? -80 : 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
                {/* Background layer — separate from content for clean blur */}
                <div
                    className={`absolute inset-0 transition-all duration-500 ${scrolled
                        ? "bg-base-dark/80 backdrop-blur-xl border-b border-white/[0.06]"
                        : "bg-transparent"
                        }`}
                />

                {/* Content */}
                <div className={`relative z-10 max-w-7xl mx-auto px-5 md:px-10 flex items-center justify-between transition-all duration-500 ${scrolled ? "py-3" : "py-5"}`}>
                    {/* ── Logo ── */}
                    <a href="#" className="flex items-center gap-3 group" onClick={closeMenu}>
                        <div className="relative w-9 h-9 flex items-center justify-center">
                            <motion.div
                                className="absolute inset-0 border-2 border-accent-red"
                                animate={{ rotate: scrolled ? 135 : 45 }}
                                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            />
                            <motion.div
                                className="absolute inset-[3px] border border-accent-red/30"
                                animate={{ rotate: scrolled ? 135 : 45 }}
                                transition={{ duration: 0.8, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-[family-name:var(--font-heading)] text-[15px] font-bold tracking-[0.15em] text-white leading-none">
                                {STORE.name}
                            </span>
                            <span className="font-[family-name:var(--font-body)] text-[8px] tracking-[0.35em] text-text-muted uppercase leading-none mt-1 hidden sm:block">
                                {STORE.tagline}
                            </span>
                        </div>
                    </a>

                    {/* ── Desktop Nav Links ── */}
                    <div className="hidden md:flex items-center gap-1">
                        {NAV_LINKS.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className="relative font-[family-name:var(--font-heading)] text-[10px] tracking-[0.25em] text-text-secondary hover:text-white px-4 py-2 transition-colors duration-300 group"
                            >
                                {link.label}
                                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-accent-red group-hover:w-3/4 transition-all duration-400 ease-out" />
                            </a>
                        ))}
                    </div>

                    {/* ── Desktop Actions ── */}
                    <div className="hidden md:flex items-center gap-2">
                        <SearchOverlay />

                        {/* Cart */}
                        <button
                            onClick={toggleCart}
                            className="relative p-2.5 text-text-secondary hover:text-white transition-colors duration-300 hover:bg-white/5 rounded-lg"
                            aria-label="Open cart"
                            id="cart-button"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />
                            </svg>
                            <AnimatePresence>
                                {totalItems > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        className="absolute -top-0.5 -right-0.5 bg-accent-red text-white text-[8px] font-[family-name:var(--font-heading)] w-[18px] h-[18px] flex items-center justify-center rounded-full"
                                    >
                                        {totalItems}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </button>

                        {/* Auth */}
                        {user ? (
                            <UserMenu />
                        ) : (
                            <button
                                onClick={() => openAuthModal("signin")}
                                className="p-2.5 text-text-secondary hover:text-white transition-colors duration-300 hover:bg-white/5 rounded-lg"
                                id="sign-in-button"
                                aria-label="Sign in"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </button>
                        )}

                        {/* CTA */}
                        <a
                            href="#shop"
                            className="ml-2 font-[family-name:var(--font-heading)] text-[10px] tracking-[0.2em] bg-accent-red hover:bg-accent-red-bright text-white px-5 py-2 transition-all duration-300 hover:shadow-[0_0_25px_rgba(183,28,28,0.4)] active:scale-95"
                        >
                            SHOP NOW
                        </a>
                    </div>

                    {/* ── Mobile Actions ── */}
                    <div className="flex md:hidden items-center gap-1">
                        <SearchOverlay />

                        {/* Cart */}
                        <button
                            onClick={toggleCart}
                            className="relative p-2.5 text-text-secondary hover:text-white transition-colors"
                            aria-label="Open cart"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />
                            </svg>
                            {totalItems > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 bg-accent-red text-white text-[8px] font-[family-name:var(--font-heading)] w-[18px] h-[18px] flex items-center justify-center rounded-full">
                                    {totalItems}
                                </span>
                            )}
                        </button>

                        {/* Auth */}
                        {user ? (
                            <UserMenu />
                        ) : (
                            <button
                                onClick={() => openAuthModal("signin")}
                                className="p-2.5 text-text-secondary hover:text-white transition-colors"
                                aria-label="Sign in"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </button>
                        )}

                        {/* Hamburger */}
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="relative w-10 h-10 flex items-center justify-center"
                            aria-label="Toggle menu"
                        >
                            <motion.span
                                animate={menuOpen
                                    ? { rotate: 45, y: 0, width: 20 }
                                    : { rotate: 0, y: -5, width: 20 }
                                }
                                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                className="absolute h-[1.5px] bg-white block origin-center"
                            />
                            <motion.span
                                animate={menuOpen
                                    ? { scaleX: 0, opacity: 0 }
                                    : { scaleX: 1, opacity: 1 }
                                }
                                transition={{ duration: 0.2 }}
                                className="absolute h-[1.5px] w-5 bg-white block"
                            />
                            <motion.span
                                animate={menuOpen
                                    ? { rotate: -45, y: 0, width: 20 }
                                    : { rotate: 0, y: 5, width: 14 }
                                }
                                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                className="absolute h-[1.5px] bg-white block origin-center"
                            />
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* ── Full-Screen Mobile Menu ── */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        className="fixed inset-0 z-40 md:hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Backdrop */}
                        <div className="absolute inset-0 bg-base-dark/95 backdrop-blur-2xl" />

                        {/* Menu Content */}
                        <motion.div
                            className="relative z-10 flex flex-col items-center justify-center h-full gap-2 px-8"
                            variants={menuVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            {NAV_LINKS.map((link) => (
                                <motion.a
                                    key={link.href}
                                    href={link.href}
                                    onClick={closeMenu}
                                    variants={itemVariants}
                                    className="font-[family-name:var(--font-heading)] text-2xl tracking-[0.15em] text-text-secondary hover:text-white py-3 transition-colors duration-300 relative group"
                                >
                                    {link.label}
                                    <span className="absolute bottom-1 left-0 w-0 h-[1px] bg-accent-red group-hover:w-full transition-all duration-400" />
                                </motion.a>
                            ))}

                            <motion.div variants={itemVariants} className="mt-6">
                                <a
                                    href="#shop"
                                    onClick={closeMenu}
                                    className="font-[family-name:var(--font-heading)] text-[12px] tracking-[0.25em] bg-accent-red hover:bg-accent-red-bright text-white px-10 py-3.5 transition-all duration-300 hover:shadow-[0_0_30px_rgba(183,28,28,0.5)] inline-block"
                                >
                                    SHOP NOW
                                </a>
                            </motion.div>

                            {/* Bottom brand */}
                            <motion.p
                                variants={itemVariants}
                                className="absolute bottom-8 font-[family-name:var(--font-body)] text-[9px] tracking-[0.4em] text-text-muted uppercase"
                            >
                                {STORE.tagline}
                            </motion.p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
