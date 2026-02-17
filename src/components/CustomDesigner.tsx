"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";

const TSHIRT_COLORS = [
    { name: "Black", hex: "#111111", textColor: "text-white" },
    { name: "White", hex: "#F5F5F5", textColor: "text-black" },
    { name: "Navy", hex: "#1a237e", textColor: "text-white" },
    { name: "Red", hex: "#b71c1c", textColor: "text-white" },
    { name: "Gray", hex: "#424242", textColor: "text-white" },
];

const SIZES = ["S", "M", "L", "XL", "XXL"];

const PRINT_AREAS = [
    { value: "front", label: "Front Only" },
    { value: "back", label: "Back Only" },
    { value: "both", label: "Front + Back" },
];

const PRINT_TYPES = [
    { value: "dtg", label: "DTG (Digital)" },
    { value: "screen", label: "Screen Print" },
    { value: "embroidery", label: "Embroidery" },
];

interface Plan {
    id: string;
    name: string;
    price: number;
    features: string[];
    printAreas: string[];
    printTypes: string[];
    badge?: string;
}

const PLANS: Plan[] = [
    {
        id: "basic",
        name: "BASIC",
        price: 999,
        features: ["Front print only", "DTG printing", "Standard cotton", "5-7 day delivery"],
        printAreas: ["front"],
        printTypes: ["dtg"],
    },
    {
        id: "premium",
        name: "PREMIUM",
        price: 1499,
        features: ["Front + Back print", "DTG or Screen Print", "Premium cotton blend", "3-5 day delivery"],
        printAreas: ["front", "back", "both"],
        printTypes: ["dtg", "screen"],
        badge: "POPULAR",
    },
    {
        id: "ultra",
        name: "ULTRA",
        price: 1999,
        features: ["Both sides print", "Any print type", "Heavyweight cotton", "Priority 2-3 day delivery"],
        printAreas: ["front", "back", "both"],
        printTypes: ["dtg", "screen", "embroidery"],
        badge: "BEST VALUE",
    },
];

export default function CustomDesigner() {
    const { addItem } = useCart();
    const { showToast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState(TSHIRT_COLORS[0]);
    const [selectedSize, setSelectedSize] = useState("M");
    const [selectedPlan, setSelectedPlan] = useState<Plan>(PLANS[1]); // Default to Premium
    const [selectedPrintArea, setSelectedPrintArea] = useState("front");
    const [selectedPrintType, setSelectedPrintType] = useState("dtg");
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = (ev) => setUploadedImage(ev.target?.result as string);
            reader.readAsDataURL(file);
        }
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = (ev) => setUploadedImage(ev.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleAddToCart = () => {
        if (!uploadedImage) {
            showToast("Please upload a design image first", "error");
            return;
        }

        const customProduct = {
            id: `custom-${Date.now()}`,
            name: `Custom Tee — ${selectedPlan.name}`,
            price: selectedPlan.price,
            image: uploadedImage,
            category: "custom" as const,
            description: `${selectedColor.name} / ${selectedPrintArea} / ${selectedPrintType}`,
            sizes: SIZES,
        };

        addItem(customProduct, selectedSize);
        showToast(`Custom ${selectedPlan.name} tee added to cart!`, "success");
    };

    const labelClass = "font-[family-name:var(--font-heading)] text-[9px] tracking-[0.25em] text-text-muted block mb-2";

    return (
        <section id="custom-design" className="py-12 md:py-20">
            <div className="max-w-6xl mx-auto px-4 md:px-6">
                {/* Section Header */}
                <div className="text-center mb-10 md:mb-14">
                    <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl md:text-5xl tracking-[0.2em] text-white mb-3">
                        DESIGN YOUR OWN
                    </h2>
                    <p className="text-text-secondary text-sm md:text-base tracking-wider max-w-xl mx-auto">
                        Upload your artwork, pick your style, and we&apos;ll print it on premium tees.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* ─── Left: T-Shirt Preview ─── */}
                    <div className="flex flex-col items-center">
                        {/* Mockup */}
                        <div
                            className="relative w-full max-w-sm aspect-[3/4] rounded-sm overflow-hidden border border-white/10"
                            style={{ backgroundColor: selectedColor.hex }}
                        >
                            {/* T-shirt base silhouette */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-10">
                                <svg viewBox="0 0 200 240" className="w-3/4 h-3/4" fill="currentColor">
                                    <path d="M60,10 L30,40 L50,50 L50,230 L150,230 L150,50 L170,40 L140,10 L120,25 C115,30 85,30 80,25 Z" />
                                </svg>
                            </div>

                            {/* Uploaded image overlay */}
                            {uploadedImage ? (
                                <div className="absolute inset-0 flex items-center justify-center p-12 md:p-16">
                                    <div className="relative w-full h-full max-w-[200px] max-h-[200px]">
                                        <Image
                                            src={uploadedImage}
                                            alt="Your custom design"
                                            fill
                                            className="object-contain drop-shadow-2xl"
                                            sizes="200px"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <p className={`font-[family-name:var(--font-heading)] text-sm tracking-[0.2em] ${selectedColor.textColor} opacity-30`}>
                                        YOUR DESIGN HERE
                                    </p>
                                </div>
                            )}

                            {/* Print area label */}
                            <div className="absolute bottom-3 left-3">
                                <span className="bg-black/50 backdrop-blur-sm text-white text-[9px] font-[family-name:var(--font-heading)] tracking-[0.15em] px-2 py-1 rounded-sm">
                                    {selectedPrintArea.toUpperCase()} PRINT
                                </span>
                            </div>
                        </div>

                        {/* Color Picker */}
                        <div className="mt-6 flex items-center gap-3">
                            <span className={labelClass}>COLOR:</span>
                            <div className="flex gap-2">
                                {TSHIRT_COLORS.map((c) => (
                                    <button
                                        key={c.name}
                                        onClick={() => setSelectedColor(c)}
                                        className={`w-7 h-7 rounded-full border-2 transition-all duration-200 ${selectedColor.name === c.name
                                                ? "border-accent-red scale-110"
                                                : "border-white/20 hover:border-white/40"
                                            }`}
                                        style={{ backgroundColor: c.hex }}
                                        title={c.name}
                                    />
                                ))}
                            </div>
                            <span className="font-[family-name:var(--font-body)] text-[11px] text-text-muted tracking-wider">
                                {selectedColor.name}
                            </span>
                        </div>

                        {/* Upload Area */}
                        <div
                            className={`mt-6 w-full max-w-sm border-2 border-dashed rounded-sm p-6 text-center cursor-pointer transition-all duration-300 ${dragActive
                                    ? "border-accent-red bg-accent-red/5"
                                    : uploadedImage
                                        ? "border-green-500/30 bg-green-500/5"
                                        : "border-white/20 hover:border-white/40"
                                }`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            {uploadedImage ? (
                                <div>
                                    <p className="font-[family-name:var(--font-heading)] text-[11px] tracking-[0.15em] text-green-400 mb-1">
                                        ✓ DESIGN UPLOADED
                                    </p>
                                    <p className="font-[family-name:var(--font-body)] text-[11px] text-text-muted tracking-wider">
                                        Click or drag to replace
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-3xl mb-2">🎨</p>
                                    <p className="font-[family-name:var(--font-heading)] text-[11px] tracking-[0.15em] text-white mb-1">
                                        DRAG & DROP YOUR DESIGN
                                    </p>
                                    <p className="font-[family-name:var(--font-body)] text-[11px] text-text-muted tracking-wider">
                                        or click to browse · PNG, JPG, SVG
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ─── Right: Options + Plans ─── */}
                    <div className="space-y-6">
                        {/* Size Selector */}
                        <div>
                            <label className={labelClass}>SIZE</label>
                            <div className="flex gap-2">
                                {SIZES.map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => setSelectedSize(s)}
                                        className={`w-11 h-11 font-[family-name:var(--font-heading)] text-[11px] tracking-[0.1em] rounded-sm border transition-all duration-200 ${selectedSize === s
                                                ? "bg-accent-red border-accent-red text-white"
                                                : "bg-transparent border-white/10 text-text-muted hover:border-white/30 hover:text-white"
                                            }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Print Area */}
                        <div>
                            <label className={labelClass}>PRINT AREA</label>
                            <div className="flex gap-2">
                                {PRINT_AREAS.filter((pa) => selectedPlan.printAreas.includes(pa.value)).map((pa) => (
                                    <button
                                        key={pa.value}
                                        onClick={() => setSelectedPrintArea(pa.value)}
                                        className={`px-4 py-2.5 font-[family-name:var(--font-heading)] text-[10px] tracking-[0.12em] rounded-sm border transition-all duration-200 ${selectedPrintArea === pa.value
                                                ? "bg-accent-red/20 border-accent-red/50 text-accent-red"
                                                : "bg-transparent border-white/10 text-text-muted hover:border-white/30 hover:text-white"
                                            }`}
                                    >
                                        {pa.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Print Type */}
                        <div>
                            <label className={labelClass}>PRINT TYPE</label>
                            <div className="flex gap-2">
                                {PRINT_TYPES.filter((pt) => selectedPlan.printTypes.includes(pt.value)).map((pt) => (
                                    <button
                                        key={pt.value}
                                        onClick={() => setSelectedPrintType(pt.value)}
                                        className={`px-4 py-2.5 font-[family-name:var(--font-heading)] text-[10px] tracking-[0.12em] rounded-sm border transition-all duration-200 ${selectedPrintType === pt.value
                                                ? "bg-accent-red/20 border-accent-red/50 text-accent-red"
                                                : "bg-transparent border-white/10 text-text-muted hover:border-white/30 hover:text-white"
                                            }`}
                                    >
                                        {pt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* ─── Plan Selector Cards ─── */}
                        <div>
                            <label className={labelClass}>CHOOSE YOUR PLAN</label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {PLANS.map((plan) => (
                                    <motion.button
                                        key={plan.id}
                                        onClick={() => {
                                            setSelectedPlan(plan);
                                            // Reset print area/type if not available in new plan
                                            if (!plan.printAreas.includes(selectedPrintArea)) setSelectedPrintArea(plan.printAreas[0]);
                                            if (!plan.printTypes.includes(selectedPrintType)) setSelectedPrintType(plan.printTypes[0]);
                                        }}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`relative p-4 rounded-sm border text-left transition-all duration-300 ${selectedPlan.id === plan.id
                                                ? "bg-accent-red/10 border-accent-red/50 shadow-[0_0_20px_rgba(183,28,28,0.15)]"
                                                : "bg-neutral-carbon/30 border-white/5 hover:border-white/15"
                                            }`}
                                    >
                                        {plan.badge && (
                                            <span className="absolute -top-2 right-2 bg-accent-red text-white text-[8px] font-[family-name:var(--font-heading)] tracking-[0.15em] px-2 py-0.5 rounded-sm">
                                                {plan.badge}
                                            </span>
                                        )}
                                        <p className="font-[family-name:var(--font-heading)] text-[12px] tracking-[0.15em] text-white mb-1">
                                            {plan.name}
                                        </p>
                                        <p className="font-[family-name:var(--font-heading)] text-xl text-white mb-3">
                                            ₹{plan.price}
                                        </p>
                                        <ul className="space-y-1.5">
                                            {plan.features.map((f, i) => (
                                                <li
                                                    key={i}
                                                    className="font-[family-name:var(--font-body)] text-[10px] text-text-muted tracking-wider flex items-start gap-1.5"
                                                >
                                                    <span className={`mt-0.5 ${selectedPlan.id === plan.id ? "text-accent-red" : "text-text-muted"}`}>
                                                        ✓
                                                    </span>
                                                    {f}
                                                </li>
                                            ))}
                                        </ul>
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Add to Cart */}
                        <div className="pt-2">
                            <AnimatePresence mode="wait">
                                <motion.button
                                    key={selectedPlan.price}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -5 }}
                                    onClick={handleAddToCart}
                                    className="w-full bg-accent-red hover:bg-accent-red-bright text-white font-[family-name:var(--font-heading)] text-[12px] tracking-[0.2em] py-4 transition-all duration-400 hover:shadow-[0_0_30px_rgba(183,28,28,0.5)] relative overflow-hidden group"
                                >
                                    <span className="relative z-10">
                                        ADD TO CART — ₹{selectedPlan.price}
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-accent-red-bright to-accent-red opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                </motion.button>
                            </AnimatePresence>
                            <p className="font-[family-name:var(--font-body)] text-[10px] text-text-muted tracking-wider text-center mt-3">
                                {selectedColor.name} · {selectedSize} · {selectedPrintArea} · {selectedPrintType} · {selectedPlan.name} Plan
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
