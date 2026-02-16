"use client";

import { ReactNode, useRef } from "react";
import { motion, useInView } from "framer-motion";

interface RevealOnScrollProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    direction?: "up" | "left" | "right";
}

export default function RevealOnScroll({ children, className = "", delay = 0, direction = "up" }: RevealOnScrollProps) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: "-60px" });

    const initial = {
        opacity: 0,
        y: direction === "up" ? 40 : 0,
        x: direction === "left" ? -40 : direction === "right" ? 40 : 0,
    };

    return (
        <motion.div
            ref={ref}
            initial={initial}
            animate={inView ? { opacity: 1, y: 0, x: 0 } : initial}
            transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
