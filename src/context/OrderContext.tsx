"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { CartItem } from "./CartContext";

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
    addOrder: (items: CartItem[], address: OrderAddress, total: number, paymentId: string, orderId: string) => Order;
    getOrders: () => Order[];
    isOrdersOpen: boolean;
    openOrders: () => void;
    closeOrders: () => void;
}

const STORAGE_KEY = "tsank_orders";

const OrderContext = createContext<OrderContextType | undefined>(undefined);

function loadOrders(): Order[] {
    if (typeof window === "undefined") return [];
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

function saveOrders(orders: Order[]) {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

export function OrderProvider({ children }: { children: ReactNode }) {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isOrdersOpen, setIsOrdersOpen] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        setOrders(loadOrders());
    }, []);

    const addOrder = useCallback(
        (items: CartItem[], address: OrderAddress, total: number, paymentId: string, orderId: string): Order => {
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

            setOrders((prev) => {
                const updated = [order, ...prev];
                saveOrders(updated);
                return updated;
            });

            // Also POST to server for admin
            fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(order),
            }).catch(() => { /* silent fail for server storage */ });

            return order;
        },
        []
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
