"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TESTIMONIALS = [
    {
        name: "Arjun K.",
        text: "The Optimus Prime Heritage tee is incredible. The print quality is unmatched — survived 20+ washes and still looks brand new!",
        rating: 5,
        product: "Optimus Prime Heritage",
    },
    {
        name: "Priya S.",
        text: "Ordered the Megatron Dark Rise for my boyfriend. He absolutely loved it. The fabric feels premium, and shipping was super fast.",
        rating: 5,
        product: "Megatron Dark Rise",
    },
    {
        name: "Rahul M.",
        text: "Best Transformers merch in India, period. The Decepticon Cyber Emblem is 🔥. Already ordered two more designs.",
        rating: 5,
        product: "Decepticon Cyber Emblem",
    },
    {
        name: "Sneha D.",
        text: "The Bumblebee Chibi is so cute! Love the attention to detail. Perfect for college — everyone asks where I got it.",
        rating: 4,
        product: "Bumblebee Chibi Edition",
    },
    {
        name: "Vikram T.",
        text: "Retro Squad '84 is a nostalgia bomb. The 80s art style is spot on. Sanket really knows his Transformers.",
        rating: 5,
        product: "Retro Squad '84",
    },
];

export default function TestimonialCarousel() {
    const [current, setCurrent] = useState(0);
    const [paused, setPaused] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (paused) return;
        timerRef.current = setInterval(() => {
            setCurrent((prev) => (prev + 1) % TESTIMONIALS.length);
        }, 5000);
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [paused]);

    return (
        <section className="py-10 md:py-16 px-6 md:px-10">
            <div className="max-w-4xl mx-auto text-center">

                <div
                    ref={ref}
                    onMouseEnter={() => setPaused(true)}
                    onMouseLeave={() => setPaused(false)}
                    className="relative min-h-[200px]"
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={current}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            className="px-4"
                        >
                            {/* Stars */}
                            <div className="flex justify-center gap-1 mb-6">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <svg
                                        key={i}
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill={i < TESTIMONIALS[current].rating ? "#B71C1C" : "none"}
                                        stroke="#B71C1C"
                                        strokeWidth="1.5"
                                    >
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                    </svg>
                                ))}
                            </div>

                            {/* Quote */}
                            <p className="font-[family-name:var(--font-body)] text-lg md:text-xl text-text-secondary leading-relaxed tracking-wide mb-6 italic">
                                &ldquo;{TESTIMONIALS[current].text}&rdquo;
                            </p>

                            {/* Author */}
                            <div>
                                <p className="font-[family-name:var(--font-heading)] text-sm tracking-[0.15em] text-white">
                                    {TESTIMONIALS[current].name}
                                </p>
                                <p className="font-[family-name:var(--font-body)] text-[11px] tracking-[0.2em] text-text-muted mt-1">
                                    on {TESTIMONIALS[current].product}
                                </p>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Dots */}
                <div className="flex justify-center gap-2 mt-8">
                    {TESTIMONIALS.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrent(i)}
                            className={`w-2 h-2 rounded-full transition-all duration-400 ${i === current ? "bg-accent-red w-6" : "bg-neutral-700 hover:bg-neutral-600"}`}
                            aria-label={`Go to testimonial ${i + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
