"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

interface OrderItem {
    productId: string;
    productName: string;
    productImage: string;
    size: string;
    quantity: number;
    price: number;
}

interface OrderAddress {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
}

type OrderStatus = "confirmed" | "shipped" | "delivered";

interface Order {
    id: string;
    items: OrderItem[];
    address: OrderAddress;
    total: number;
    status: OrderStatus;
    paymentId: string;
    orderId: string;
    createdAt: string;
}

const ADMIN_PASSWORD = "tsank2026";

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string }> = {
    confirmed: { label: "Confirmed", color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/30" },
    shipped: { label: "Shipped", color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/30" },
    delivered: { label: "Delivered", color: "text-green-400", bg: "bg-green-400/10 border-green-400/30" },
};

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function AdminPage() {
    const [authenticated, setAuthenticated] = useState(false);
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all");

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/orders");
            const data = await res.json();
            setOrders(data);
        } catch {
            console.error("Failed to fetch orders");
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        if (authenticated) fetchOrders();
    }, [authenticated, fetchOrders]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === ADMIN_PASSWORD) {
            setAuthenticated(true);
            setError("");
        } else {
            setError("Invalid password");
        }
    };

    const updateStatus = async (orderId: string, status: OrderStatus) => {
        try {
            await fetch("/api/orders", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId, status }),
            });
            setOrders((prev) =>
                prev.map((o) => (o.id === orderId ? { ...o, status } : o))
            );
        } catch {
            console.error("Failed to update status");
        }
    };

    const filteredOrders = statusFilter === "all" ? orders : orders.filter((o) => o.status === statusFilter);
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const pendingCount = orders.filter((o) => o.status !== "delivered").length;

    // ── Login Screen ──
    if (!authenticated) {
        return (
            <div className="min-h-screen bg-base-dark flex items-center justify-center p-4">
                <div className="w-full max-w-sm">
                    <div className="text-center mb-8">
                        <h1 className="font-[family-name:var(--font-heading)] text-2xl tracking-[0.3em] text-white mb-2">
                            T-SANK
                        </h1>
                        <p className="font-[family-name:var(--font-heading)] text-[10px] tracking-[0.3em] text-text-muted">
                            ADMIN DASHBOARD
                        </p>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="font-[family-name:var(--font-heading)] text-[10px] tracking-[0.25em] text-text-muted block mb-2">
                                PASSWORD
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter admin password"
                                className="w-full bg-neutral-carbon border border-white/10 px-4 py-3 text-sm text-white tracking-wider focus:outline-none focus:border-accent-red/50 transition-colors placeholder:text-text-muted rounded-sm"
                            />
                        </div>
                        {error && (
                            <p className="text-red-400 text-sm font-[family-name:var(--font-body)] tracking-wider">
                                {error}
                            </p>
                        )}
                        <button
                            type="submit"
                            className="w-full bg-accent-red hover:bg-accent-red-bright text-white font-[family-name:var(--font-heading)] text-[12px] tracking-[0.2em] py-3 transition-all duration-300"
                        >
                            LOGIN
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // ── Dashboard ──
    return (
        <div className="min-h-screen bg-base-dark">
            {/* Top Bar */}
            <header className="border-b border-white/8 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h1 className="font-[family-name:var(--font-heading)] text-lg tracking-[0.2em] text-white">
                        T-SANK ADMIN
                    </h1>
                    <span className="bg-accent-red/20 text-accent-red text-[9px] font-[family-name:var(--font-heading)] tracking-[0.15em] px-2 py-0.5 rounded-sm">
                        OWNER
                    </span>
                </div>
                <button
                    onClick={() => setAuthenticated(false)}
                    className="font-[family-name:var(--font-heading)] text-[10px] tracking-[0.2em] text-text-muted hover:text-white transition-colors"
                >
                    LOGOUT
                </button>
            </header>

            <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className="bg-neutral-carbon/40 border border-white/5 rounded-sm p-5">
                        <p className="font-[family-name:var(--font-heading)] text-[9px] tracking-[0.3em] text-text-muted mb-1">
                            TOTAL ORDERS
                        </p>
                        <p className="font-[family-name:var(--font-heading)] text-3xl text-white">
                            {orders.length}
                        </p>
                    </div>
                    <div className="bg-neutral-carbon/40 border border-white/5 rounded-sm p-5">
                        <p className="font-[family-name:var(--font-heading)] text-[9px] tracking-[0.3em] text-text-muted mb-1">
                            TOTAL REVENUE
                        </p>
                        <p className="font-[family-name:var(--font-heading)] text-3xl text-green-400">
                            ₹{totalRevenue.toLocaleString("en-IN")}
                        </p>
                    </div>
                    <div className="bg-neutral-carbon/40 border border-white/5 rounded-sm p-5">
                        <p className="font-[family-name:var(--font-heading)] text-[9px] tracking-[0.3em] text-text-muted mb-1">
                            PENDING
                        </p>
                        <p className="font-[family-name:var(--font-heading)] text-3xl text-yellow-400">
                            {pendingCount}
                        </p>
                    </div>
                </div>

                {/* Filter + Refresh */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-2">
                        {(["all", "confirmed", "shipped", "delivered"] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setStatusFilter(f)}
                                className={`font-[family-name:var(--font-heading)] text-[10px] tracking-[0.15em] px-3 py-1.5 rounded-sm border transition-all duration-200 ${statusFilter === f
                                        ? "bg-accent-red/20 border-accent-red/50 text-accent-red"
                                        : "bg-transparent border-white/10 text-text-muted hover:text-white hover:border-white/20"
                                    }`}
                            >
                                {f.toUpperCase()}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={fetchOrders}
                        disabled={loading}
                        className="font-[family-name:var(--font-heading)] text-[10px] tracking-[0.2em] text-text-muted hover:text-white transition-colors disabled:opacity-50"
                    >
                        {loading ? "LOADING..." : "↻ REFRESH"}
                    </button>
                </div>

                {/* Orders Table */}
                {filteredOrders.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-4xl mb-4">📦</p>
                        <p className="font-[family-name:var(--font-heading)] text-sm tracking-[0.15em] text-text-muted">
                            {statusFilter === "all" ? "NO ORDERS YET" : `NO ${statusFilter.toUpperCase()} ORDERS`}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredOrders.map((order) => {
                            const sc = STATUS_CONFIG[order.status];
                            const isExpanded = expandedOrder === order.id;

                            return (
                                <div
                                    key={order.id}
                                    className="bg-neutral-carbon/30 border border-white/5 rounded-sm overflow-hidden"
                                >
                                    {/* Order Row */}
                                    <div
                                        className="p-4 flex items-center gap-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
                                        onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                                    >
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-1">
                                                <span className="font-[family-name:var(--font-heading)] text-[11px] tracking-[0.1em] text-white">
                                                    {order.address.fullName}
                                                </span>
                                                <span className={`font-[family-name:var(--font-heading)] text-[9px] tracking-[0.15em] px-2 py-0.5 rounded-sm border ${sc.bg} ${sc.color}`}>
                                                    {sc.label.toUpperCase()}
                                                </span>
                                            </div>
                                            <p className="font-[family-name:var(--font-body)] text-[11px] text-text-muted tracking-wider">
                                                {order.items.length} item{order.items.length > 1 ? "s" : ""} · {formatDate(order.createdAt)}
                                            </p>
                                        </div>
                                        <span className="font-[family-name:var(--font-heading)] text-base text-white">
                                            ₹{order.total}
                                        </span>
                                        <svg
                                            className={`w-4 h-4 text-text-muted transition-transform ${isExpanded ? "rotate-180" : ""}`}
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>

                                    {/* Expanded Detail */}
                                    {isExpanded && (
                                        <div className="border-t border-white/5 p-4 space-y-4">
                                            {/* Items */}
                                            <div className="space-y-2">
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
                                                        <div className="flex-1">
                                                            <p className="font-[family-name:var(--font-heading)] text-[10px] tracking-[0.1em] text-white">
                                                                {item.productName}
                                                            </p>
                                                            <p className="font-[family-name:var(--font-body)] text-[10px] text-text-muted tracking-wider">
                                                                Size: {item.size} × {item.quantity} @ ₹{item.price}
                                                            </p>
                                                        </div>
                                                        <span className="font-[family-name:var(--font-heading)] text-[11px] text-white">
                                                            ₹{item.price * item.quantity}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Address */}
                                            <div className="bg-base-dark/50 border border-white/5 rounded-sm p-3">
                                                <p className="font-[family-name:var(--font-heading)] text-[9px] tracking-[0.2em] text-text-muted mb-2">
                                                    SHIPPING ADDRESS
                                                </p>
                                                <p className="font-[family-name:var(--font-body)] text-sm text-white tracking-wider">
                                                    {order.address.fullName}
                                                </p>
                                                <p className="font-[family-name:var(--font-body)] text-[12px] text-text-secondary tracking-wider">
                                                    {order.address.address}
                                                </p>
                                                <p className="font-[family-name:var(--font-body)] text-[12px] text-text-secondary tracking-wider">
                                                    {order.address.city}, {order.address.state} — {order.address.pincode}
                                                </p>
                                                <p className="font-[family-name:var(--font-body)] text-[12px] text-text-muted tracking-wider mt-1">
                                                    📞 {order.address.phone} · ✉ {order.address.email}
                                                </p>
                                            </div>

                                            {/* Payment Info */}
                                            <div className="flex items-center gap-4 text-[11px] font-[family-name:var(--font-body)] text-text-muted tracking-wider">
                                                <span>Order: {order.orderId}</span>
                                                <span>Payment: {order.paymentId}</span>
                                            </div>

                                            {/* Status Update */}
                                            <div className="flex items-center gap-2">
                                                <span className="font-[family-name:var(--font-heading)] text-[9px] tracking-[0.2em] text-text-muted">
                                                    UPDATE STATUS:
                                                </span>
                                                {(["confirmed", "shipped", "delivered"] as OrderStatus[]).map((s) => {
                                                    const cfg = STATUS_CONFIG[s];
                                                    return (
                                                        <button
                                                            key={s}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                updateStatus(order.id, s);
                                                            }}
                                                            className={`font-[family-name:var(--font-heading)] text-[9px] tracking-[0.15em] px-3 py-1 rounded-sm border transition-all duration-200 ${order.status === s
                                                                    ? `${cfg.bg} ${cfg.color}`
                                                                    : "border-white/10 text-text-muted hover:text-white hover:border-white/20"
                                                                }`}
                                                        >
                                                            {cfg.label.toUpperCase()}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
