"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useOrders, OrderStatus } from "@/context/OrderContext";

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; icon: string }> = {
    confirmed: { label: "CONFIRMED", color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30", icon: "✓" },
    shipped: { label: "SHIPPED", color: "text-blue-400 bg-blue-400/10 border-blue-400/30", icon: "🚚" },
    delivered: { label: "DELIVERED", color: "text-green-400 bg-green-400/10 border-green-400/30", icon: "📦" },
};

const STATUS_STEPS: OrderStatus[] = ["confirmed", "shipped", "delivered"];

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function MyOrdersDrawer() {
    const { orders, isOrdersOpen, closeOrders } = useOrders();

    return (
        <AnimatePresence>
            {isOrdersOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80]"
                        onClick={closeOrders}
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed right-0 top-0 h-full w-full max-w-md bg-base-dark border-l border-white/10 z-[85] flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-5 border-b border-white/8">
                            <div className="flex items-center gap-3">
                                <h2 className="font-[family-name:var(--font-heading)] text-sm tracking-[0.2em] text-white">
                                    MY ORDERS
                                </h2>
                                {orders.length > 0 && (
                                    <span className="bg-accent-red/20 text-accent-red text-[10px] font-[family-name:var(--font-heading)] tracking-[0.15em] px-2 py-0.5 rounded-sm">
                                        {orders.length}
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={closeOrders}
                                className="w-8 h-8 flex items-center justify-center text-text-muted hover:text-white transition-colors"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Orders List */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            {orders.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full px-6 text-center">
                                    <div className="text-5xl mb-4">📋</div>
                                    <h3 className="font-[family-name:var(--font-heading)] text-sm tracking-[0.15em] text-white mb-2">
                                        NO ORDERS YET
                                    </h3>
                                    <p className="font-[family-name:var(--font-body)] text-sm text-text-muted tracking-wider mb-6">
                                        Your order history will appear here after your first purchase.
                                    </p>
                                    <a
                                        href="#shop"
                                        onClick={closeOrders}
                                        className="font-[family-name:var(--font-heading)] text-[11px] tracking-[0.2em] bg-accent-red hover:bg-accent-red-bright text-white px-6 py-3 transition-all duration-300"
                                    >
                                        START SHOPPING
                                    </a>
                                </div>
                            ) : (
                                <div className="p-4 space-y-4">
                                    {orders.map((order) => {
                                        const statusCfg = STATUS_CONFIG[order.status];
                                        const stepIdx = STATUS_STEPS.indexOf(order.status);

                                        return (
                                            <div
                                                key={order.id}
                                                className="bg-neutral-carbon/40 border border-white/5 rounded-sm overflow-hidden"
                                            >
                                                {/* Order Header */}
                                                <div className="p-4 pb-3 border-b border-white/5">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="font-[family-name:var(--font-heading)] text-[10px] tracking-[0.2em] text-text-muted">
                                                            {order.id}
                                                        </span>
                                                        <span className={`font-[family-name:var(--font-heading)] text-[9px] tracking-[0.2em] px-2 py-1 rounded-sm border ${statusCfg.color}`}>
                                                            {statusCfg.icon} {statusCfg.label}
                                                        </span>
                                                    </div>
                                                    <p className="font-[family-name:var(--font-body)] text-[11px] text-text-muted tracking-wider">
                                                        {formatDate(order.createdAt)}
                                                    </p>
                                                </div>

                                                {/* Status Timeline */}
                                                <div className="px-4 py-3 border-b border-white/5">
                                                    <div className="flex items-center gap-1">
                                                        {STATUS_STEPS.map((s, i) => (
                                                            <div key={s} className="flex items-center flex-1">
                                                                <div
                                                                    className={`w-2.5 h-2.5 rounded-full flex-shrink-0 transition-colors ${i <= stepIdx ? "bg-accent-red" : "bg-neutral-700"
                                                                        }`}
                                                                />
                                                                {i < STATUS_STEPS.length - 1 && (
                                                                    <div
                                                                        className={`flex-1 h-[2px] mx-1 transition-colors ${i < stepIdx ? "bg-accent-red" : "bg-neutral-700"
                                                                            }`}
                                                                    />
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="flex justify-between mt-1.5">
                                                        {STATUS_STEPS.map((s) => (
                                                            <span
                                                                key={s}
                                                                className="font-[family-name:var(--font-body)] text-[8px] tracking-[0.1em] text-text-muted uppercase"
                                                            >
                                                                {s}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Items */}
                                                <div className="p-4 space-y-2">
                                                    {order.items.map((item, idx) => (
                                                        <div key={idx} className="flex items-center gap-3">
                                                            <div className="relative w-10 h-10 flex-shrink-0 rounded-sm overflow-hidden bg-neutral-carbon">
                                                                <Image
                                                                    src={item.productImage}
                                                                    alt={item.productName}
                                                                    fill
                                                                    sizes="40px"
                                                                    className="object-cover"
                                                                />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="font-[family-name:var(--font-heading)] text-[10px] tracking-[0.1em] text-white truncate">
                                                                    {item.productName}
                                                                </p>
                                                                <p className="font-[family-name:var(--font-body)] text-[10px] text-text-muted tracking-wider">
                                                                    {item.size} × {item.quantity}
                                                                </p>
                                                            </div>
                                                            <span className="font-[family-name:var(--font-heading)] text-[11px] text-white">
                                                                ₹{item.price * item.quantity}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Address + Total */}
                                                <div className="px-4 pb-4 pt-0">
                                                    <div className="flex justify-between items-center pt-3 border-t border-white/5">
                                                        <div>
                                                            <p className="font-[family-name:var(--font-body)] text-[10px] text-text-muted tracking-wider">
                                                                📍 {order.address.city}, {order.address.state}
                                                            </p>
                                                        </div>
                                                        <span className="font-[family-name:var(--font-heading)] text-sm text-white">
                                                            ₹{order.total}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
