"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { PRODUCTS, Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";

function fuzzyMatch(text: string, query: string): boolean {
    const lower = text.toLowerCase();
    const q = query.toLowerCase();
    let qi = 0;
    for (let i = 0; i < lower.length && qi < q.length; i++) {
        if (lower[i] === q[qi]) qi++;
    }
    return qi === q.length;
}

export default function SearchOverlay() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const { addItem } = useCart();
    const { showToast } = useToast();

    const results: Product[] = query.length > 0
        ? PRODUCTS.filter(
            (p) => fuzzyMatch(p.name, query) || fuzzyMatch(p.description, query) || fuzzyMatch(p.category, query)
        )
        : [];

    const handleOpen = useCallback(() => {
        setOpen(true);
        setQuery("");
    }, []);

    const handleClose = useCallback(() => {
        setOpen(false);
        setQuery("");
    }, []);

    // Ctrl+K shortcut
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "k") {
                e.preventDefault();
                handleOpen();
            }
            if (e.key === "Escape" && open) {
                handleClose();
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [open, handleOpen, handleClose]);

    // Auto-focus
    useEffect(() => {
        if (open && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [open]);

    const handleAddToCart = (product: Product) => {
        const size = product.sizes[1] || product.sizes[0];
        addItem(product, size);
        showToast(`${product.name} added to cart!`, "success");
        handleClose();
    };

    return (
        <>
            {/* Search trigger — called by Navbar */}
            <button
                onClick={handleOpen}
                className="p-2 text-text-secondary hover:text-white transition-colors duration-300"
                aria-label="Search"
                id="search-trigger"
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                </svg>
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100] flex items-start justify-center pt-[15vh]"
                        onClick={handleClose}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.96 }}
                            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                            className="bg-base-dark border border-white/10 rounded-sm w-full max-w-xl mx-4 overflow-hidden shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Input */}
                            <div className="flex items-center gap-3 p-4 border-b border-white/8">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-muted flex-shrink-0">
                                    <circle cx="11" cy="11" r="8" />
                                    <path d="m21 21-4.3-4.3" />
                                </svg>
                                <input
                                    ref={inputRef}
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search products..."
                                    className="flex-1 bg-transparent text-white font-[family-name:var(--font-body)] text-base tracking-wider outline-none placeholder:text-text-muted"
                                />
                                <kbd className="hidden sm:flex items-center gap-1 text-[10px] tracking-wider text-text-muted border border-white/10 px-2 py-1 rounded">
                                    ESC
                                </kbd>
                            </div>

                            {/* Results */}
                            <div className="max-h-[50vh] overflow-y-auto">
                                {query.length > 0 && results.length === 0 ? (
                                    <div className="p-8 text-center">
                                        <p className="font-[family-name:var(--font-body)] text-sm text-text-muted tracking-wider">
                                            No products found for &ldquo;{query}&rdquo;
                                        </p>
                                    </div>
                                ) : (
                                    results.map((product) => (
                                        <motion.div
                                            key={product.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors duration-200 cursor-pointer border-b border-white/5 last:border-0"
                                            onClick={() => handleAddToCart(product)}
                                        >
                                            <div className="relative w-12 h-12 rounded-sm overflow-hidden bg-neutral-carbon flex-shrink-0">
                                                <Image
                                                    src={product.image}
                                                    alt={product.name}
                                                    fill
                                                    sizes="48px"
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-[family-name:var(--font-heading)] text-[12px] tracking-[0.1em] text-white truncate">
                                                    {product.name}
                                                </p>
                                                <p className="font-[family-name:var(--font-body)] text-[11px] text-text-muted tracking-wider truncate">
                                                    {product.description}
                                                </p>
                                            </div>
                                            <span className="font-[family-name:var(--font-heading)] text-sm text-white flex-shrink-0">
                                                ₹{product.price}
                                            </span>
                                        </motion.div>
                                    ))
                                )}

                                {query.length === 0 && (
                                    <div className="p-8 text-center">
                                        <p className="font-[family-name:var(--font-body)] text-sm text-text-muted tracking-wider">
                                            Start typing to search products...
                                        </p>
                                        <p className="font-[family-name:var(--font-body)] text-[11px] text-text-muted tracking-wider mt-2">
                                            💡 Try &ldquo;optimus&rdquo;, &ldquo;decepticon&rdquo;, or &ldquo;retro&rdquo;
                                        </p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
