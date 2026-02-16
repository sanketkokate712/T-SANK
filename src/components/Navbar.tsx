"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_LINKS, STORE } from "@/data/products";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <motion.nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? "glass py-3" : "bg-transparent py-5"
                }`}
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
            <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">
                {/* Logo */}
                <a href="#" className="flex items-center gap-3 group">
                    <div className="relative w-10 h-10 flex items-center justify-center">
                        <div className="absolute inset-0 border-2 border-accent-red rotate-45 group-hover:rotate-[135deg] transition-transform duration-700" />
                        <div className="absolute inset-1 border border-accent-red/30 rotate-45 group-hover:rotate-[135deg] transition-transform duration-700 delay-75" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-[family-name:var(--font-heading)] text-lg font-bold tracking-[0.15em] text-white leading-none">
                            {STORE.name}
                        </span>
                        <span className="font-[family-name:var(--font-body)] text-[9px] tracking-[0.35em] text-text-muted uppercase leading-none mt-1">
                            {STORE.tagline}
                        </span>
                    </div>
                </a>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {NAV_LINKS.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="font-[family-name:var(--font-heading)] text-[11px] tracking-[0.25em] text-text-secondary hover:text-white transition-colors duration-400 relative group"
                        >
                            {link.label}
                            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-accent-red group-hover:w-full transition-all duration-500" />
                        </a>
                    ))}
                    <a
                        href="#shop"
                        className="font-[family-name:var(--font-heading)] text-[11px] tracking-[0.2em] bg-accent-red hover:bg-accent-red-bright text-white px-5 py-2.5 transition-all duration-400 hover:shadow-[0_0_20px_rgba(183,28,28,0.4)]"
                    >
                        SHOP NOW
                    </a>
                </div>

                {/* Mobile Hamburger */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="md:hidden flex flex-col gap-1.5 w-8 h-8 items-center justify-center"
                    aria-label="Toggle menu"
                >
                    <motion.span
                        animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                        className="w-6 h-[1.5px] bg-white block"
                    />
                    <motion.span
                        animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
                        className="w-6 h-[1.5px] bg-white block"
                    />
                    <motion.span
                        animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                        className="w-6 h-[1.5px] bg-white block"
                    />
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden glass mt-2 mx-4 rounded overflow-hidden"
                    >
                        <div className="flex flex-col py-4">
                            {NAV_LINKS.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMenuOpen(false)}
                                    className="font-[family-name:var(--font-heading)] text-[12px] tracking-[0.2em] text-text-secondary hover:text-white px-6 py-3 transition-colors"
                                >
                                    {link.label}
                                </a>
                            ))}
                            <div className="px-6 pt-2">
                                <a
                                    href="#shop"
                                    className="block text-center font-[family-name:var(--font-heading)] text-[11px] tracking-[0.2em] bg-accent-red text-white px-5 py-2.5"
                                >
                                    SHOP NOW
                                </a>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
