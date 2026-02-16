"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import Image from "next/image";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";

interface ProductQuickViewProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function ProductQuickView({ product, isOpen, onClose }: ProductQuickViewProps) {
    const [selectedSize, setSelectedSize] = useState("");
    const { addItem } = useCart();
    const { showToast } = useToast();
    const cardRef = useRef<HTMLDivElement>(null);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const rotateX = useTransform(mouseY, [-150, 150], [8, -8]);
    const rotateY = useTransform(mouseX, [-150, 150], [-8, 8]);

    const handleMouseMove = useCallback(
        (e: React.MouseEvent) => {
            const rect = cardRef.current?.getBoundingClientRect();
            if (!rect) return;
            mouseX.set(e.clientX - rect.left - rect.width / 2);
            mouseY.set(e.clientY - rect.top - rect.height / 2);
        },
        [mouseX, mouseY]
    );

    const handleMouseLeave = useCallback(() => {
        mouseX.set(0);
        mouseY.set(0);
    }, [mouseX, mouseY]);

    if (!product) return null;

    const size = selectedSize || product.sizes[1] || product.sizes[0];

    const handleAdd = () => {
        addItem(product, size);
        showToast(`${product.name} (${size}) added to cart!`, "success");
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-md z-[80]"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 40 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="fixed inset-0 z-[85] flex items-center justify-center p-4 pointer-events-none"
                    >
                        <motion.div
                            ref={cardRef}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                            style={{ rotateX, rotateY, transformPerspective: 800 }}
                            className="bg-base-dark border border-white/10 rounded-sm max-w-2xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto"
                        >
                            <div className="grid md:grid-cols-2 gap-0">
                                {/* Image */}
                                <div className="relative aspect-square bg-neutral-carbon overflow-hidden">
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        className="object-cover"
                                    />
                                    {product.tag && (
                                        <div className="absolute top-4 left-4">
                                            <span className={`tag-badge tag-${product.tag.replace(/\s/g, ".")} font-[family-name:var(--font-heading)]`}>
                                                {product.tag}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Details */}
                                <div className="p-8 flex flex-col justify-between">
                                    <div>
                                        <button
                                            onClick={onClose}
                                            className="float-right text-text-muted hover:text-white transition-colors"
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M18 6L6 18M6 6l12 12" />
                                            </svg>
                                        </button>

                                        <span className="font-[family-name:var(--font-body)] text-[10px] tracking-[0.5em] text-accent-red uppercase block mb-3">
                                            {product.category}
                                        </span>
                                        <h2 className="font-[family-name:var(--font-heading)] text-xl tracking-[0.08em] text-white mb-4">
                                            {product.name}
                                        </h2>
                                        <p className="font-[family-name:var(--font-body)] text-sm text-text-secondary leading-relaxed tracking-wide mb-6">
                                            {product.description}
                                        </p>

                                        {/* Price */}
                                        <div className="flex items-center gap-3 mb-6">
                                            <span className="font-[family-name:var(--font-heading)] text-2xl font-bold text-white">
                                                ₹{product.price}
                                            </span>
                                            {product.originalPrice && (
                                                <>
                                                    <span className="font-[family-name:var(--font-body)] text-base text-text-muted line-through">
                                                        ₹{product.originalPrice}
                                                    </span>
                                                    <span className="font-[family-name:var(--font-body)] text-[11px] tracking-[0.1em] text-green-400 bg-green-400/10 px-2 py-1 rounded-sm">
                                                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                                                    </span>
                                                </>
                                            )}
                                        </div>

                                        {/* Sizes */}
                                        <div className="mb-6">
                                            <span className="font-[family-name:var(--font-heading)] text-[10px] tracking-[0.3em] text-text-muted block mb-3">
                                                SELECT SIZE
                                            </span>
                                            <div className="flex gap-2">
                                                {product.sizes.map((s) => (
                                                    <button
                                                        key={s}
                                                        onClick={() => setSelectedSize(s)}
                                                        className={`font-[family-name:var(--font-body)] text-xs tracking-wider w-10 h-10 flex items-center justify-center border transition-all duration-300 ${(selectedSize || size) === s
                                                                ? "border-accent-red bg-accent-red/20 text-white"
                                                                : "border-neutral-800 text-text-muted hover:border-neutral-700"
                                                            }`}
                                                    >
                                                        {s}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="space-y-3">
                                        <button
                                            onClick={handleAdd}
                                            className="w-full bg-accent-red hover:bg-accent-red-bright text-white font-[family-name:var(--font-heading)] text-[12px] tracking-[0.2em] py-4 transition-all duration-400 hover:shadow-[0_0_30px_rgba(183,28,28,0.5)]"
                                        >
                                            ADD TO CART
                                        </button>
                                        <button
                                            onClick={onClose}
                                            className="w-full border border-white/10 text-text-secondary font-[family-name:var(--font-heading)] text-[11px] tracking-[0.2em] py-3 hover:border-white/20 hover:text-white transition-all duration-300"
                                        >
                                            CONTINUE BROWSING
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
