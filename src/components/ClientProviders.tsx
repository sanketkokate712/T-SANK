"use client";

import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/context/ToastContext";
import { OrderProvider } from "@/context/OrderContext";
import CartDrawer from "@/components/CartDrawer";
import MyOrdersDrawer from "@/components/MyOrdersDrawer";
import AuthProvider from "@/components/AuthProvider";
import AOSProvider from "@/components/AOSProvider";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <AOSProvider>
                <CartProvider>
                    <OrderProvider>
                        <ToastProvider>
                            {children}
                            <CartDrawer />
                            <MyOrdersDrawer />
                        </ToastProvider>
                    </OrderProvider>
                </CartProvider>
            </AOSProvider>
        </AuthProvider>
    );
}

