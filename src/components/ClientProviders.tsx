"use client";

import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/context/ToastContext";
import CartDrawer from "@/components/CartDrawer";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
    return (
        <CartProvider>
            <ToastProvider>
                {children}
                <CartDrawer />
            </ToastProvider>
        </CartProvider>
    );
}
