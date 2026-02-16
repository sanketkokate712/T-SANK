"use client";

import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/context/ToastContext";
import CartDrawer from "@/components/CartDrawer";
import AuthProvider from "@/components/AuthProvider";
import AOSProvider from "@/components/AOSProvider";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <AOSProvider>
                <CartProvider>
                    <ToastProvider>
                        {children}
                        <CartDrawer />
                    </ToastProvider>
                </CartProvider>
            </AOSProvider>
        </AuthProvider>
    );
}
