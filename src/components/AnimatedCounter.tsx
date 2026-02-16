"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface AnimatedCounterProps {
    end: number;
    suffix?: string;
    prefix?: string;
    duration?: number;
    label: string;
}

export default function AnimatedCounter({ end, suffix = "", prefix = "", duration = 2, label }: AnimatedCounterProps) {
    const ref = useRef<HTMLDivElement>(null);
    const numberRef = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, margin: "-80px" });
    const hasAnimated = useRef(false);

    if (inView && !hasAnimated.current && numberRef.current) {
        hasAnimated.current = true;
        const start = 0;
        const startTime = Date.now();
        const durationMs = duration * 1000;

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / durationMs, 1);
            // Ease out cubic
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(start + (end - start) * easedProgress);

            if (numberRef.current) {
                numberRef.current.textContent = prefix + current + suffix;
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
    }

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="bg-base-dark p-8 text-center group hover:bg-neutral-carbon/20 transition-colors duration-500"
        >
            <span
                ref={numberRef}
                className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold text-white group-hover:text-accent-red transition-colors duration-500 block mb-2"
            >
                {prefix}0{suffix}
            </span>
            <span className="font-[family-name:var(--font-body)] text-[11px] tracking-[0.25em] text-text-muted uppercase">
                {label}
            </span>
        </motion.div>
    );
}
