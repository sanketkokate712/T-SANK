"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { PRODUCTS, CATEGORIES, Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";

function ProductCard({ product, index }: { product: Product; index: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: "-60px" });
    const [selectedSize, setSelectedSize] = useState(product.sizes[1] || product.sizes[0]);
    const { addItem } = useCart();
    const { showToast } = useToast();

    const tagClass = product.tag
        ? `tag-${product.tag.replace(/\s/g, ".")}`
        : "tag-default";

    const handleAddToCart = () => {
        addItem(product, selectedSize);
        showToast(`${product.name} (${selectedSize}) added to cart!`, "success");
    };

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{
                duration: 0.7,
                delay: index * 0.1,
                ease: [0.16, 1, 0.3, 1],
            }}
            className="product-card rounded-sm overflow-hidden group cursor-pointer"
        >
            {/* Image */}
            <div className="relative aspect-square overflow-hidden bg-neutral-carbon">
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-base-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Tag */}
                {product.tag && (
                    <div className="absolute top-3 left-3">
                        <span className={`tag-badge ${tagClass} font-[family-name:var(--font-heading)]`}>
                            {product.tag}
                        </span>
                    </div>
                )}

                {/* Quick View on hover */}
                <motion.div
                    className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0"
                >
                    <button
                        onClick={handleAddToCart}
                        className="w-full bg-accent-red hover:bg-accent-red-bright text-white font-[family-name:var(--font-heading)] text-[11px] tracking-[0.2em] py-3 transition-colors duration-300 hover:shadow-[0_0_20px_rgba(183,28,28,0.4)]"
                    >
                        ADD TO CART
                    </button>
                </motion.div>
            </div>

            {/* Info */}
            <div className="p-5">
                <h3 className="font-[family-name:var(--font-heading)] text-[13px] tracking-[0.1em] text-white mb-2 group-hover:text-accent-red-bright transition-colors duration-400">
                    {product.name}
                </h3>
                <p className="font-[family-name:var(--font-body)] text-[12px] text-text-muted leading-relaxed mb-3 line-clamp-2">
                    {product.description}
                </p>

                {/* Sizes */}
                <div className="flex gap-1.5 mb-4">
                    {product.sizes.map((size) => (
                        <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`font-[family-name:var(--font-body)] text-[10px] tracking-[0.1em] w-8 h-8 flex items-center justify-center border transition-all duration-300 ${selectedSize === size
                                ? "border-accent-red bg-accent-red/20 text-white"
                                : "border-neutral-800 text-text-muted hover:border-neutral-700 hover:text-text-secondary"
                                }`}
                        >
                            {size}
                        </button>
                    ))}
                </div>

                {/* Price */}
                <div className="flex items-center gap-3">
                    <span className="font-[family-name:var(--font-heading)] text-lg font-bold text-white">
                        ₹{product.price}
                    </span>
                    {product.originalPrice && (
                        <span className="font-[family-name:var(--font-body)] text-sm text-text-muted line-through">
                            ₹{product.originalPrice}
                        </span>
                    )}
                    {product.originalPrice && (
                        <span className="font-[family-name:var(--font-body)] text-[10px] tracking-[0.1em] text-green-400">
                            {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

export default function ProductGrid() {
    const [activeCategory, setActiveCategory] = useState("all");
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: "-80px" });

    const filtered =
        activeCategory === "all"
            ? PRODUCTS
            : PRODUCTS.filter((p) => p.category === activeCategory);

    return (
        <section id="shop" ref={ref} className="py-20 md:py-32 px-6 md:px-10 max-w-7xl mx-auto">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-center mb-16"
            >
                <span className="font-[family-name:var(--font-body)] text-[11px] tracking-[0.5em] text-accent-red uppercase block mb-3">
                    Collection
                </span>
                <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold tracking-[0.06em] text-white mb-4">
                    CHOOSE YOUR SIDE
                </h2>
                <p className="font-[family-name:var(--font-body)] text-text-secondary max-w-lg mx-auto tracking-wide">
                    Every t-shirt tells a story. Pick your faction, wear your allegiance.
                </p>
            </motion.div>

            {/* Category Filter */}
            <div className="flex justify-center gap-2 mb-12 flex-wrap">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`font-[family-name:var(--font-heading)] text-[10px] tracking-[0.25em] px-5 py-2.5 border transition-all duration-400 ${activeCategory === cat.id
                            ? "border-accent-red bg-accent-red/15 text-white"
                            : "border-neutral-800 text-text-muted hover:border-neutral-700 hover:text-text-secondary"
                            }`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((product, i) => (
                    <ProductCard key={product.id} product={product} index={i} />
                ))}
            </div>
        </section>
    );
}
