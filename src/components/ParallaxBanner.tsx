"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

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
    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1]);
    const textY = useTransform(scrollYProgress, [0, 0.5, 1], [40, 0, -40]);

    return (
        <section ref={ref} className="relative h-[40vh] sm:h-[50vh] md:h-[60vh] overflow-hidden">
            {/* Parallax BG — Next.js Image for reliable loading */}
            <motion.div
                className="absolute inset-0 will-change-transform"
                style={{ y, scale }}
            >
                <div className="absolute inset-[-25%]">
                    <Image
                        src={imageSrc}
                        alt={title}
                        fill
                        sizes="100vw"
                        className="object-cover object-center"
                        priority
                    />
                </div>
            </motion.div>

            {/* Dark overlays for readability */}
            <div className="absolute inset-0 bg-base-dark/55" />
            <div className="absolute inset-0 bg-gradient-to-r from-base-dark/80 via-transparent to-base-dark/80" />
            <div className="absolute inset-0 bg-gradient-to-t from-base-dark/60 via-transparent to-base-dark/60" />

            {/* Content */}
            <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6 z-10"
                style={{ opacity }}
            >
                {/* Decorative line */}
                <motion.div
                    className="w-10 sm:w-14 h-[2px] bg-accent-red mb-3 sm:mb-4"
                    style={{ y: textY }}
                />
                <motion.span
                    className="font-[family-name:var(--font-body)] text-[9px] sm:text-[10px] md:text-[11px] tracking-[0.4em] sm:tracking-[0.5em] text-accent-red uppercase mb-2 sm:mb-3 md:mb-4"
                    style={{ y: textY }}
                >
                    {subtitle}
                </motion.span>
                <motion.h2
                    className="font-[family-name:var(--font-heading)] text-xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-black tracking-[0.05em] sm:tracking-[0.08em] text-white text-glow-red leading-tight"
                    style={{ y: textY }}
                >
                    {title}
                </motion.h2>
                <motion.div
                    className="w-10 sm:w-14 h-[2px] bg-accent-red mt-3 sm:mt-4"
                    style={{ y: textY }}
                />
            </motion.div>

            {/* Edge lines */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent-red/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent-red/30 to-transparent" />
        </section>
    );
}
