"use client";

import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/context/ToastContext";
import { OrderProvider } from "@/context/OrderContext";
import CartDrawer from "@/components/CartDrawer";
import MyOrdersDrawer from "@/components/MyOrdersDrawer";
import AOSProvider from "@/components/AOSProvider";
import { FirebaseAuthProvider } from "@/context/FirebaseAuthContext";
import AuthModal from "@/components/AuthModal";
import ProfileModal from "@/components/ProfileModal";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
    return (
        <FirebaseAuthProvider>
            <AOSProvider>
                <CartProvider>
                    <ToastProvider>
                        <OrderProvider>
                            {children}
                            <CartDrawer />
                            <MyOrdersDrawer />
                            <AuthModal />
                            <ProfileModal />
                        </OrderProvider>
                    </ToastProvider>
                </CartProvider>
            </AOSProvider>
        </FirebaseAuthProvider>
    );
}
