"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";

declare global {
    interface Window {
        Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
    }
}

interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    handler: (response: RazorpayResponse) => void;
    prefill: { name: string; email: string };
    theme: { color: string };
    modal?: { ondismiss?: () => void };
}

interface RazorpayInstance {
    open: () => void;
}

interface RazorpayResponse {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
    const { items, totalPrice, totalItems, clearCart, closeCart } = useCart();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);

    const loadRazorpayScript = (): Promise<boolean> => {
        return new Promise((resolve) => {
            if (document.getElementById("razorpay-script")) {
                resolve(true);
                return;
            }
            const script = document.createElement("script");
            script.id = "razorpay-script";
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePay = async () => {
        setLoading(true);
        try {
            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) {
                showToast("Failed to load payment gateway", "error");
                setLoading(false);
                return;
            }

            const res = await fetch("/api/razorpay/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: totalPrice,
                    currency: "INR",
                    receipt: `tsank_${Date.now()}`,
                }),
            });

            const order = await res.json();
            if (!res.ok) {
                showToast(order.error || "Failed to create order", "error");
                setLoading(false);
                return;
            }

            const options: RazorpayOptions = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
                amount: order.amount,
                currency: order.currency,
                name: "T-SANK",
                description: `${totalItems} item(s) — Premium Transformers Merch`,
                order_id: order.id,
                handler: async (response: RazorpayResponse) => {
                    const verifyRes = await fetch("/api/razorpay/verify", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(response),
                    });
                    const result = await verifyRes.json();
                    if (result.verified) {
                        showToast("Payment successful! 🎉 Order confirmed.", "success");
                        clearCart();
                        closeCart();
                        onClose();
                    } else {
                        showToast("Payment verification failed", "error");
                    }
                },
                prefill: { name: "", email: "" },
                theme: { color: "#B71C1C" },
                modal: {
                    ondismiss: () => setLoading(false),
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch {
            showToast("Something went wrong", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-md z-[90]"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.92, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92, y: 30 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="fixed inset-0 z-[95] flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className="bg-base-dark border border-white/10 rounded-sm max-w-lg w-full max-h-[90vh] overflow-y-auto pointer-events-auto">
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-white/8">
                                <h2 className="font-[family-name:var(--font-heading)] text-base tracking-[0.15em] text-white">
                                    CHECKOUT
                                </h2>
                                <button
                                    onClick={onClose}
                                    className="w-8 h-8 flex items-center justify-center text-text-muted hover:text-white transition-colors"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M18 6L6 18M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Order Summary */}
                            <div className="p-6 space-y-4">
                                <h3 className="font-[family-name:var(--font-heading)] text-[11px] tracking-[0.3em] text-text-muted mb-4">
                                    ORDER SUMMARY
                                </h3>

                                {items.map((item) => (
                                    <div key={`${item.product.id}-${item.size}`} className="flex items-center gap-4">
                                        <div className="relative w-14 h-14 flex-shrink-0 overflow-hidden rounded-sm bg-neutral-carbon">
                                            <Image
                                                src={item.product.image}
                                                alt={item.product.name}
                                                fill
                                                sizes="56px"
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-[family-name:var(--font-heading)] text-[11px] tracking-[0.1em] text-white truncate">
                                                {item.product.name}
                                            </p>
                                            <p className="font-[family-name:var(--font-body)] text-[11px] text-text-muted tracking-wider">
                                                Size: {item.size} × {item.quantity}
                                            </p>
                                        </div>
                                        <span className="font-[family-name:var(--font-heading)] text-sm text-white">
                                            ₹{item.product.price * item.quantity}
                                        </span>
                                    </div>
                                ))}

                                {/* Divider */}
                                <div className="h-[1px] bg-white/8 my-4" />

                                {/* Totals */}
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="font-[family-name:var(--font-body)] text-sm text-text-secondary tracking-wider">
                                            Subtotal ({totalItems} items)
                                        </span>
                                        <span className="font-[family-name:var(--font-heading)] text-sm text-white">
                                            ₹{totalPrice}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-[family-name:var(--font-body)] text-sm text-text-secondary tracking-wider">
                                            Shipping
                                        </span>
                                        <span className="font-[family-name:var(--font-body)] text-sm text-green-400 tracking-wider">
                                            FREE
                                        </span>
                                    </div>
                                    <div className="h-[1px] bg-white/8" />
                                    <div className="flex justify-between pt-2">
                                        <span className="font-[family-name:var(--font-heading)] text-sm tracking-[0.15em] text-white">
                                            TOTAL
                                        </span>
                                        <span className="font-[family-name:var(--font-heading)] text-xl font-bold text-white">
                                            ₹{totalPrice}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Pay Button */}
                            <div className="p-6 pt-0 space-y-3">
                                <button
                                    onClick={handlePay}
                                    disabled={loading || items.length === 0}
                                    className="w-full bg-accent-red hover:bg-accent-red-bright disabled:opacity-50 disabled:cursor-not-allowed text-white font-[family-name:var(--font-heading)] text-[12px] tracking-[0.2em] py-4 transition-all duration-400 hover:shadow-[0_0_30px_rgba(183,28,28,0.5)] relative overflow-hidden group"
                                    id="pay-now-button"
                                >
                                    <span className="relative z-10">
                                        {loading ? "PROCESSING..." : "PAY NOW — ₹" + totalPrice}
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-accent-red-bright to-accent-red opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                </button>
                                <button
                                    onClick={onClose}
                                    className="w-full border border-white/10 text-text-secondary font-[family-name:var(--font-heading)] text-[11px] tracking-[0.2em] py-3 hover:border-white/20 hover:text-white transition-all duration-300"
                                >
                                    BACK TO CART
                                </button>
                                <p className="font-[family-name:var(--font-body)] text-[10px] text-text-muted tracking-wider text-center">
                                    🔒 Secured by Razorpay. Your payment info is safe.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
