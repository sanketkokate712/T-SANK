"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { STORE } from "@/data/products";

const TOTAL_FRAMES = 184;
const FOLDER = "/images/transformer-sequence/";

/** Info pop-ups that appear at specific frame ranges */
const FRAME_POPUPS = [
    {
        startFrame: 1,
        endFrame: 25,
        title: "TRUCK MODE",
        text: "The iconic Optimus Prime in vehicle form — raw power concealed in a classic design.",
        position: "left" as const,
    },
    {
        startFrame: 35,
        endFrame: 55,
        title: "INITIATING SHIFT",
        text: "Mechanical gears engage. The transformation protocol begins its sequence.",
        position: "right" as const,
    },
    {
        startFrame: 65,
        endFrame: 85,
        title: "CORE EXPOSED",
        text: "The heart of the machine reveals itself — Energon core pulsing with power.",
        position: "left" as const,
    },
    {
        startFrame: 95,
        endFrame: 120,
        title: "RESHAPING",
        text: "Metal bends, panels shift. Every component finds its new purpose.",
        position: "right" as const,
    },
    {
        startFrame: 130,
        endFrame: 155,
        title: "RISING",
        text: "From vehicle to warrior. The humanoid form takes shape — unstoppable.",
        position: "left" as const,
    },
    {
        startFrame: 165,
        endFrame: 184,
        title: "FULLY TRANSFORMED",
        text: "Optimus Prime stands tall. Leader. Protector. Now available on your chest.",
        position: "right" as const,
    },
];

export default function HeroSection() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imagesRef = useRef<HTMLImageElement[]>([]);
    const [loaded, setLoaded] = useState(false);
    const [loadProgress, setLoadProgress] = useState(0);
    const [currentFrame, setCurrentFrame] = useState(0);
    const frameRef = useRef(0);
    const sectionRef = useRef<HTMLDivElement>(null);

    // Preload in batches
    useEffect(() => {
        let count = 0;
        const imgs: HTMLImageElement[] = new Array(TOTAL_FRAMES);

        const loadBatch = async (start: number, batchSize: number) => {
            const promises: Promise<void>[] = [];
            for (let i = start; i < Math.min(start + batchSize, TOTAL_FRAMES); i++) {
                promises.push(
                    new Promise((resolve) => {
                        const img = new Image();
                        img.onload = () => {
                            count++;
                            setLoadProgress(Math.round((count / TOTAL_FRAMES) * 100));
                            resolve();
                        };
                        img.onerror = () => { count++; resolve(); };
                        img.src = `${FOLDER}${i + 1}.jpg`;
                        imgs[i] = img;
                    })
                );
            }
            await Promise.all(promises);
        };

        const loadAll = async () => {
            const batchSize = 12;
            for (let i = 0; i < TOTAL_FRAMES; i += batchSize) {
                await loadBatch(i, batchSize);
            }
            imagesRef.current = imgs;
            setLoaded(true);
            drawFrame(0);
        };

        loadAll();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const setupCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        const ctx = canvas.getContext("2d");
        if (ctx) ctx.scale(dpr, dpr);
        if (loaded) drawFrame(frameRef.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loaded]);

    useEffect(() => {
        setupCanvas();
        window.addEventListener("resize", setupCanvas);
        return () => window.removeEventListener("resize", setupCanvas);
    }, [setupCanvas]);

    const drawFrame = useCallback((idx: number) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        const img = imagesRef.current[idx];
        if (!canvas || !ctx || !img) return;
        const dpr = window.devicePixelRatio || 1;
        const cw = canvas.width / dpr;
        const ch = canvas.height / dpr;
        ctx.clearRect(0, 0, cw, ch);
        const ia = img.naturalWidth / img.naturalHeight;
        const ca = cw / ch;
        let dw: number, dh: number, dx: number, dy: number;
        if (ia > ca) { dh = ch; dw = dh * ia; dx = (cw - dw) / 2; dy = 0; }
        else { dw = cw; dh = dw / ia; dx = 0; dy = (ch - dh) / 2; }
        ctx.drawImage(img, dx, dy, dw, dh);
    }, []);

    // Scroll-driven frame animation
    useEffect(() => {
        const onScroll = () => {
            const section = sectionRef.current;
            if (!section || !loaded) return;
            const rect = section.getBoundingClientRect();
            const progress = Math.max(0, Math.min(1, -rect.top / (rect.height - window.innerHeight)));
            const idx = Math.min(Math.floor(progress * TOTAL_FRAMES), TOTAL_FRAMES - 1);
            if (idx !== frameRef.current) {
                frameRef.current = idx;
                setCurrentFrame(idx);
                requestAnimationFrame(() => drawFrame(idx));
            }
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, [loaded, drawFrame]);

    // Find active popup
    const activePopup = FRAME_POPUPS.find(
        (p) => currentFrame + 1 >= p.startFrame && currentFrame + 1 <= p.endFrame
    );

    return (
        <section ref={sectionRef} className="relative h-[500vh]">
            <div className="sticky top-0 h-screen w-full overflow-hidden">
                {/* Canvas */}
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full"
                    aria-hidden="true"
                />

                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-b from-base-dark/50 via-transparent to-base-dark pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-base-dark/50 via-transparent to-base-dark/50 pointer-events-none" />

                {/* Loading */}
                {!loaded && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-base-dark z-30">
                        <div className="relative w-56 h-[2px] bg-neutral-carbon overflow-hidden mb-5">
                            <div
                                className="absolute inset-y-0 left-0 bg-accent-red transition-all duration-200"
                                style={{ width: `${loadProgress}%` }}
                            />
                        </div>
                        <span className="font-[family-name:var(--font-heading)] text-[11px] tracking-[0.4em] text-text-muted">
                            LOADING SEQUENCE {loadProgress}%
                        </span>
                    </div>
                )}

                {/* Hero content — only show in first few frames */}
                <AnimatePresence>
                    {currentFrame < 15 && loaded && (
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center z-10"
                        >
                            <span className="font-[family-name:var(--font-body)] text-[11px] tracking-[0.6em] text-accent-red uppercase mb-4">
                                {STORE.tagline}
                            </span>
                            <h1 className="font-[family-name:var(--font-heading)] text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-[0.05em] text-white text-glow-red leading-[0.9]">
                                {STORE.name}
                            </h1>
                            <p className="mt-6 max-w-md font-[family-name:var(--font-body)] text-base md:text-lg text-text-secondary tracking-wide leading-relaxed">
                                Premium Transformers merchandise for students who wear their allegiance.
                            </p>
                            <div className="mt-10 flex gap-4 flex-wrap justify-center">
                                <a href="#shop" className="font-[family-name:var(--font-heading)] text-[12px] tracking-[0.2em] bg-accent-red hover:bg-accent-red-bright text-white px-8 py-3.5 transition-all duration-400 hover:shadow-[0_0_30px_rgba(183,28,28,0.5)]">
                                    EXPLORE COLLECTION
                                </a>
                                <a href="#about" className="font-[family-name:var(--font-heading)] text-[12px] tracking-[0.2em] border border-white/20 text-white px-8 py-3.5 hover:border-white/50 hover:bg-white/5 transition-all duration-400">
                                    OUR STORY
                                </a>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ═══ Info Pop-ups at key frames ═══ */}
                <AnimatePresence mode="wait">
                    {activePopup && loaded && (
                        <motion.div
                            key={activePopup.title}
                            initial={{ opacity: 0, x: activePopup.position === "left" ? -60 : 60, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: activePopup.position === "left" ? -40 : 40, scale: 0.95 }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            className={`absolute top-1/2 -translate-y-1/2 z-20 max-w-xs sm:max-w-sm ${activePopup.position === "left"
                                    ? "left-5 sm:left-10 md:left-16"
                                    : "right-5 sm:right-10 md:right-16"
                                }`}
                        >
                            <div className="relative p-5 sm:p-6 bg-base-dark/80 backdrop-blur-xl border border-white/10 rounded-sm">
                                {/* Red accent bar */}
                                <div className={`absolute top-0 ${activePopup.position === "left" ? "left-0" : "right-0"} w-[3px] h-full bg-accent-red`} />
                                {/* Corner brackets */}
                                <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-accent-red/50" />
                                <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-accent-red/50" />

                                <span className="font-[family-name:var(--font-body)] text-[9px] tracking-[0.5em] text-accent-red uppercase block mb-2">
                                    FRAME {currentFrame + 1} / {TOTAL_FRAMES}
                                </span>
                                <h3 className="font-[family-name:var(--font-heading)] text-lg sm:text-xl tracking-[0.08em] text-white mb-2 text-glow-red">
                                    {activePopup.title}
                                </h3>
                                <p className="font-[family-name:var(--font-body)] text-sm text-text-secondary leading-relaxed">
                                    {activePopup.text}
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Scroll indicator */}
                {currentFrame < 5 && loaded && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5, duration: 1 }}
                        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
                    >
                        <span className="font-[family-name:var(--font-body)] text-[9px] tracking-[0.5em] text-text-muted">
                            SCROLL TO TRANSFORM
                        </span>
                        <div className="w-[1px] h-8 bg-gradient-to-b from-text-muted to-transparent animate-pulse" />
                    </motion.div>
                )}

                {/* Frame counter */}
                <div className="absolute bottom-6 right-6 font-[family-name:var(--font-body)] text-[10px] tracking-[0.3em] text-text-muted z-10">
                    {String(currentFrame + 1).padStart(3, "0")} / {TOTAL_FRAMES}
                </div>

                {/* Progress bar */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-neutral-carbon/30 z-10">
                    <div
                        className="h-full bg-accent-red/60 transition-all duration-100"
                        style={{ width: `${((currentFrame + 1) / TOTAL_FRAMES) * 100}%` }}
                    />
                </div>
            </div>
        </section>
    );
}
