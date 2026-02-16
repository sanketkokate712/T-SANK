"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface Props {
    imageSrc: string;
    title: string;
    subtitle: string;
}

export default function ParallaxBanner({ imageSrc, title, subtitle }: Props) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.3, 1, 1, 0.3]);

    return (
        <section ref={ref} className="relative h-[50vh] md:h-[60vh] overflow-hidden">
            {/* Parallax BG */}
            <motion.div
                className="absolute inset-[-20%] bg-cover bg-center"
                style={{
                    backgroundImage: `url(${imageSrc})`,
                    y,
                }}
            />

            {/* Dark overlays */}
            <div className="absolute inset-0 bg-base-dark/60" />
            <div className="absolute inset-0 bg-gradient-to-r from-base-dark/80 via-transparent to-base-dark/80" />

            {/* Content */}
            <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10"
                style={{ opacity }}
            >
                <span className="font-[family-name:var(--font-body)] text-[11px] tracking-[0.5em] text-accent-red uppercase mb-4">
                    {subtitle}
                </span>
                <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-5xl lg:text-6xl font-black tracking-[0.08em] text-white text-glow-red">
                    {title}
                </h2>
            </motion.div>

            {/* Edge lines */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent-red/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent-red/30 to-transparent" />
        </section>
    );
}
