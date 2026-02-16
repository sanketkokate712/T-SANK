"use client";

import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/context/ToastContext";
import CartDrawer from "@/components/CartDrawer";
import AuthProvider from "@/components/AuthProvider";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <CartProvider>
                <ToastProvider>
                    {children}
                    <CartDrawer />
                </ToastProvider>
            </CartProvider>
        </AuthProvider>
    );
}
