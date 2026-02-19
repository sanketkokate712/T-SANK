"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { CartItem } from "./CartContext";
import { collection, addDoc, query, where, getDocs, serverTimestamp, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useFirebaseAuth } from "./FirebaseAuthContext";

export interface OrderAddress {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
}

export type OrderStatus = "confirmed" | "shipped" | "delivered";

export interface Order {
    id: string;
    items: {
        productId: string;
        productName: string;
        productImage: string;
        size: string;
        quantity: number;
        price: number;
    }[];
    address: OrderAddress;
    total: number;
    status: OrderStatus;
    paymentId: string;
    orderId: string;
    createdAt: string;
}

interface OrderContextType {
    orders: Order[];
    addOrder: (items: CartItem[], address: OrderAddress, total: number, paymentId: string, orderId: string) => Promise<Order>;
    getOrders: () => Order[];
    isOrdersOpen: boolean;
    openOrders: () => void;
    closeOrders: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isOrdersOpen, setIsOrdersOpen] = useState(false);
    const { user } = useFirebaseAuth();

    // Load orders from Firestore when user logs in
    useEffect(() => {
        if (!user?.uid) {
            setOrders([]);
            return;
        }
        const fetchOrders = async () => {
            try {
                const q = query(
                    collection(db, "orders"),
                    where("userId", "==", user.uid),
                    orderBy("createdAt", "desc")
                );
                const snap = await getDocs(q);
                const fetched: Order[] = snap.docs.map(d => {
                    const data = d.data();
                    return {
                        ...data,
                        id: data.id || d.id,
                        createdAt: data.createdAt?.toDate?.()?.toISOString() ?? new Date().toISOString(),
                    } as Order;
                });
                setOrders(fetched);
            } catch {
                // fallback: try localStorage
                try {
                    const stored = localStorage.getItem("tsank_orders");
                    if (stored) setOrders(JSON.parse(stored));
                } catch { /* ignore */ }
            }
        };
        fetchOrders();
    }, [user?.uid]);

    const addOrder = useCallback(
        async (items: CartItem[], address: OrderAddress, total: number, paymentId: string, orderId: string): Promise<Order> => {
            const order: Order = {
                id: `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
                items: items.map((item) => ({
                    productId: item.product.id,
                    productName: item.product.name,
                    productImage: item.product.image,
                    size: item.size,
                    quantity: item.quantity,
                    price: item.product.price,
                })),
                address,
                total,
                status: "confirmed",
                paymentId,
                orderId,
                createdAt: new Date().toISOString(),
            };

            setOrders((prev) => [order, ...prev]);

            // Save to Firestore
            try {
                await addDoc(collection(db, "orders"), {
                    ...order,
                    userId: user?.uid || "guest",
                    userEmail: user?.email || address.email,
                    createdAt: serverTimestamp(),
                });
            } catch {
                // Fallback: save to localStorage
                const stored = localStorage.getItem("tsank_orders");
                const prev = stored ? JSON.parse(stored) : [];
                localStorage.setItem("tsank_orders", JSON.stringify([order, ...prev]));
            }

            // Also POST to server for admin
            fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(order),
            }).catch(() => { /* silent */ });

            return order;
        },
        [user?.uid, user?.email]
    );

    const getOrders = useCallback(() => orders, [orders]);
    const openOrders = useCallback(() => setIsOrdersOpen(true), []);
    const closeOrders = useCallback(() => setIsOrdersOpen(false), []);

    return (
        <OrderContext.Provider value={{ orders, addOrder, getOrders, isOrdersOpen, openOrders, closeOrders }}>
            {children}
        </OrderContext.Provider>
    );
}

export function useOrders() {
    const context = useContext(OrderContext);
    if (!context) throw new Error("useOrders must be used within OrderProvider");
    return context;
}
