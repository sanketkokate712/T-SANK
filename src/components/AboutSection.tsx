"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { STORE } from "@/data/products";

export default function AboutSection() {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: "-80px" });

    const stats = [
        { value: "500+", label: "Happy Customers" },
        { value: "6", label: "Exclusive Designs" },
        { value: "100%", label: "Premium Cotton" },
        { value: "24h", label: "Fast Shipping" },
    ];

    return (
        <section id="about" ref={ref} className="py-20 md:py-32 px-6 md:px-10">
            <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    {/* Left — Story */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <span className="font-[family-name:var(--font-body)] text-[11px] tracking-[0.5em] text-accent-red uppercase block mb-4">
                            Our Story
                        </span>
                        <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold tracking-[0.06em] text-white mb-6">
                            BUILT BY A FAN,<br />FOR THE FANS
                        </h2>
                        <div className="space-y-4 font-[family-name:var(--font-body)] text-base text-text-secondary leading-relaxed tracking-wide">
                            <p>
                                {STORE.name} was born from a lifelong obsession with Transformers.
                                Founded by <span className="text-white font-medium">{STORE.owner}</span>,
                                a student and designer who believes merch should be more than a logo on a blank tee.
                            </p>
                            <p>
                                Every design is a tribute — hand-crafted graphics, premium 100% cotton,
                                and prints that survive wash after wash. We make gear for students, fans,
                                and anyone who grew up dreaming of robots in disguise.
                            </p>
                            <p>
                                Whether you roll with the Autobots or march with the Decepticons,
                                {STORE.name} has you covered.
                            </p>
                        </div>
                        <div className="mt-8">
                            <a
                                href="#shop"
                                className="font-[family-name:var(--font-heading)] text-[12px] tracking-[0.2em] bg-accent-red hover:bg-accent-red-bright text-white px-8 py-3.5 transition-all duration-400 inline-block hover:shadow-[0_0_30px_rgba(183,28,28,0.5)]"
                            >
                                SHOP THE COLLECTION
                            </a>
                        </div>
                    </motion.div>

                    {/* Right — Stats */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div className="grid grid-cols-2 gap-[1px] bg-neutral-800/30">
                            {stats.map((stat, i) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={inView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
                                    className="bg-base-dark p-8 text-center group hover:bg-neutral-carbon/20 transition-colors duration-500"
                                >
                                    <span className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold text-white group-hover:text-accent-red transition-colors duration-500 block mb-2">
                                        {stat.value}
                                    </span>
                                    <span className="font-[family-name:var(--font-body)] text-[11px] tracking-[0.25em] text-text-muted uppercase">
                                        {stat.label}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
