"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function AOSProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: "ease-out-cubic",
            once: true,
            offset: 80,
            delay: 0,
            anchorPlacement: "top-bottom",
        });

        // Refresh AOS on route changes / dynamic content
        const observer = new MutationObserver(() => {
            AOS.refresh();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        return () => observer.disconnect();
    }, []);

    return <>{children}</>;
}
