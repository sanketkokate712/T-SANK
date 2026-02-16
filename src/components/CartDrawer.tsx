"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import CheckoutModal from "@/components/CheckoutModal";

export default function CartDrawer() {
    const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice, totalItems } = useCart();
    const [checkoutOpen, setCheckoutOpen] = useState(false);

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                            onClick={closeCart}
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            className="fixed top-0 right-0 h-full w-full max-w-md bg-base-dark border-l border-white/8 z-[70] flex flex-col"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-white/8">
                                <div className="flex items-center gap-3">
                                    <h2 className="font-[family-name:var(--font-heading)] text-base tracking-[0.15em] text-white">
                                        YOUR CART
                                    </h2>
                                    {totalItems > 0 && (
                                        <span className="bg-accent-red text-white text-[10px] font-[family-name:var(--font-heading)] tracking-wider w-6 h-6 flex items-center justify-center rounded-full">
                                            {totalItems}
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={closeCart}
                                    className="w-8 h-8 flex items-center justify-center text-text-muted hover:text-white transition-colors"
                                    aria-label="Close cart"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M18 6L6 18M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Items */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                                {items.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-center">
                                        <div className="w-20 h-20 mb-6 rounded-full bg-neutral-carbon flex items-center justify-center">
                                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-muted">
                                                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />
                                            </svg>
                                        </div>
                                        <p className="font-[family-name:var(--font-heading)] text-sm tracking-[0.15em] text-text-muted mb-2">
                                            CART IS EMPTY
                                        </p>
                                        <p className="font-[family-name:var(--font-body)] text-sm text-text-muted tracking-wide">
                                            Add items to start your order
                                        </p>
                                        <button
                                            onClick={closeCart}
                                            className="mt-6 font-[family-name:var(--font-heading)] text-[11px] tracking-[0.2em] bg-accent-red hover:bg-accent-red-bright text-white px-6 py-2.5 transition-all duration-300"
                                        >
                                            BROWSE COLLECTION
                                        </button>
                                    </div>
                                ) : (
                                    <AnimatePresence>
                                        {items.map((item) => (
                                            <motion.div
                                                key={`${item.product.id}-${item.size}`}
                                                layout
                                                initial={{ opacity: 0, x: 30 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -30, height: 0 }}
                                                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                                className="flex gap-4 p-4 bg-neutral-carbon/50 border border-white/5 rounded-sm"
                                            >
                                                {/* Image */}
                                                <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden rounded-sm bg-neutral-carbon">
                                                    <Image
                                                        src={item.product.image}
                                                        alt={item.product.name}
                                                        fill
                                                        sizes="80px"
                                                        className="object-cover"
                                                    />
                                                </div>

                                                {/* Details */}
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-[family-name:var(--font-heading)] text-[11px] tracking-[0.1em] text-white truncate">
                                                        {item.product.name}
                                                    </h3>
                                                    <p className="font-[family-name:var(--font-body)] text-[11px] text-text-muted tracking-wider mt-1">
                                                        Size: {item.size}
                                                    </p>
                                                    <div className="flex items-center justify-between mt-3">
                                                        {/* Quantity */}
                                                        <div className="flex items-center gap-0 border border-white/10">
                                                            <button
                                                                onClick={() =>
                                                                    updateQuantity(
                                                                        item.product.id,
                                                                        item.size,
                                                                        item.quantity - 1
                                                                    )
                                                                }
                                                                className="w-7 h-7 flex items-center justify-center text-text-muted hover:text-white hover:bg-white/5 transition-colors text-sm"
                                                            >
                                                                −
                                                            </button>
                                                            <span className="w-8 h-7 flex items-center justify-center font-[family-name:var(--font-body)] text-xs text-white border-x border-white/10">
                                                                {item.quantity}
                                                            </span>
                                                            <button
                                                                onClick={() =>
                                                                    updateQuantity(
                                                                        item.product.id,
                                                                        item.size,
                                                                        item.quantity + 1
                                                                    )
                                                                }
                                                                className="w-7 h-7 flex items-center justify-center text-text-muted hover:text-white hover:bg-white/5 transition-colors text-sm"
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                        {/* Price */}
                                                        <span className="font-[family-name:var(--font-heading)] text-sm text-white">
                                                            ₹{item.product.price * item.quantity}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Remove */}
                                                <button
                                                    onClick={() => removeItem(item.product.id, item.size)}
                                                    className="flex-shrink-0 text-text-muted hover:text-red-400 transition-colors self-start"
                                                    aria-label="Remove item"
                                                >
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M18 6L6 18M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                )}
                            </div>

                            {/* Footer — only show when items exist */}
                            {items.length > 0 && (
                                <div className="border-t border-white/8 p-6 space-y-4">
                                    {/* Subtotal */}
                                    <div className="flex items-center justify-between">
                                        <span className="font-[family-name:var(--font-body)] text-sm text-text-secondary tracking-wider">
                                            Subtotal ({totalItems} items)
                                        </span>
                                        <span className="font-[family-name:var(--font-heading)] text-lg font-bold text-white">
                                            ₹{totalPrice}
                                        </span>
                                    </div>
                                    <p className="font-[family-name:var(--font-body)] text-[11px] text-text-muted tracking-wider">
                                        Shipping calculated at checkout
                                    </p>
                                    {/* Checkout button */}
                                    <button
                                        onClick={() => setCheckoutOpen(true)}
                                        className="w-full bg-accent-red hover:bg-accent-red-bright text-white font-[family-name:var(--font-heading)] text-[12px] tracking-[0.2em] py-4 transition-all duration-400 hover:shadow-[0_0_30px_rgba(183,28,28,0.5)] relative overflow-hidden group"
                                        id="checkout-button"
                                    >
                                        <span className="relative z-10">PROCEED TO CHECKOUT</span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-accent-red-bright to-accent-red opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    </button>
                                    <button
                                        onClick={closeCart}
                                        className="w-full border border-white/10 text-text-secondary font-[family-name:var(--font-heading)] text-[11px] tracking-[0.2em] py-3 hover:border-white/20 hover:text-white transition-all duration-300"
                                    >
                                        CONTINUE SHOPPING
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
            <CheckoutModal isOpen={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
        </>
    );
}
