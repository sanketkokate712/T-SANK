"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { PRODUCTS } from "@/data/products";

export default function FeaturedCollection() {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: "-80px" });

    const featured = PRODUCTS.filter((p) => p.tag === "BESTSELLER" || p.tag === "PREMIUM" || p.tag === "LIMITED");

    return (
        <section id="collection" ref={ref} className="py-20 md:py-32 px-6 md:px-10">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4"
                >
                    <div>
                        <span className="font-[family-name:var(--font-body)] text-[11px] tracking-[0.5em] text-accent-red uppercase block mb-3">
                            Handpicked
                        </span>
                        <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold tracking-[0.06em] text-white">
                            FEATURED PICKS
                        </h2>
                    </div>
                    <a
                        href="#shop"
                        className="font-[family-name:var(--font-heading)] text-[11px] tracking-[0.25em] text-text-secondary hover:text-accent-red transition-colors duration-400 group"
                    >
                        VIEW ALL →
                    </a>
                </motion.div>

                {/* Horizontal scroll cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {featured.map((product, i) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 40 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.7, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                            className="group relative overflow-hidden rounded-sm bg-neutral-carbon cursor-pointer"
                        >
                            <div className="relative aspect-[4/5] overflow-hidden">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-base-dark via-base-dark/20 to-transparent" />

                                {/* Info overlay at bottom */}
                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                    {product.tag && (
                                        <span className={`tag-badge tag-${product.tag.replace(/\s/g, ".")} font-[family-name:var(--font-heading)] mb-3 inline-block`}>
                                            {product.tag}
                                        </span>
                                    )}
                                    <h3 className="font-[family-name:var(--font-heading)] text-base tracking-[0.08em] text-white mb-1">
                                        {product.name}
                                    </h3>
                                    <div className="flex items-center gap-3">
                                        <span className="font-[family-name:var(--font-heading)] text-lg font-bold text-white">
                                            ₹{product.price}
                                        </span>
                                        {product.originalPrice && (
                                            <span className="font-[family-name:var(--font-body)] text-sm text-text-muted line-through">
                                                ₹{product.originalPrice}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
