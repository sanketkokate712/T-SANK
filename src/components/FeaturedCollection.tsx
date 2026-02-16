"use client";

import { useRef, useState, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { PRODUCTS } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";

interface Sparkle {
    id: number;
    x: number;
    y: number;
    size: number;
}

function SparkleEffect({ sparkles }: { sparkles: Sparkle[] }) {
    return (
        <>
            {sparkles.map((s) => (
                <motion.div
                    key={s.id}
                    className="absolute pointer-events-none z-20"
                    style={{ left: s.x, top: s.y }}
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{ scale: 1.5, opacity: 0, y: -20 }}
                    transition={{ duration: 0.6 }}
                >
                    <svg width={s.size} height={s.size} viewBox="0 0 24 24" fill="#B71C1C">
                        <polygon points="12,2 14,10 22,10 16,14 18,22 12,18 6,22 8,14 2,10 10,10" />
                    </svg>
                </motion.div>
            ))}
        </>
    );
}

export default function FeaturedCollection() {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: "-80px" });
    const [sparkles, setSparkles] = useState<Sparkle[]>([]);
    const sparkleIdRef = useRef(0);
    const { addItem } = useCart();
    const { showToast } = useToast();

    const featured = PRODUCTS.filter((p) => p.tag === "BESTSELLER" || p.tag === "PREMIUM" || p.tag === "LIMITED");

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (Math.random() > 0.7) {
            const rect = e.currentTarget.getBoundingClientRect();
            const newSparkle: Sparkle = {
                id: sparkleIdRef.current++,
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
                size: 8 + Math.random() * 8,
            };
            setSparkles((prev) => [...prev.slice(-6), newSparkle]);
        }
    }, []);

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

                {/* Cards with sparkle hover */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {featured.map((product, i) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 40 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.7, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                            className="group relative overflow-hidden rounded-sm bg-neutral-carbon cursor-pointer"
                            onMouseMove={handleMouseMove}
                        >
                            <SparkleEffect sparkles={sparkles} />
                            <div className="relative aspect-[4/5] overflow-hidden">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-base-dark via-base-dark/20 to-transparent" />

                                {/* Quick add button on hover */}
                                <motion.div
                                    className="absolute bottom-16 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0"
                                >
                                    <button
                                        onClick={() => {
                                            const size = product.sizes[1] || product.sizes[0];
                                            addItem(product, size);
                                            showToast(`${product.name} added to cart!`, "success");
                                        }}
                                        className="w-full bg-accent-red/90 hover:bg-accent-red-bright text-white font-[family-name:var(--font-heading)] text-[10px] tracking-[0.2em] py-2.5 transition-colors duration-300 backdrop-blur-sm"
                                    >
                                        QUICK ADD
                                    </button>
                                </motion.div>

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
