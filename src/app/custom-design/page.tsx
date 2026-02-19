"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import CustomDesigner from "@/components/CustomDesigner";
import ScrollFloat from "@/components/ScrollFloat/ScrollFloat";
import RevealOnScroll from "@/components/RevealOnScroll";

export default function CustomDesignPage() {
    return (
        <SmoothScroll>
            <main className="bg-base-dark min-h-screen">
                <Navbar />

                {/* Header */}
                <div className="pt-32 pb-8 flex justify-center">
                    <ScrollFloat
                        animationDuration={1}
                        ease="back.inOut(2)"
                        scrollStart="top bottom"
                        scrollEnd="bottom bottom-=40%"
                        stagger={0.03}
                        containerClassName="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-widest font-[family-name:var(--font-heading)]"
                    >
                        DESIGN YOUR OWN
                    </ScrollFloat>
                </div>
                <p className="text-center text-text-secondary text-sm md:text-base tracking-wider max-w-xl mx-auto px-6 mb-4">
                    Upload your artwork and create a unique, one-of-a-kind tee.
                </p>

                {/* Designer Component */}
                <RevealOnScroll>
                    <CustomDesigner />
                </RevealOnScroll>

                <Footer />
            </main>
        </SmoothScroll>
    );
}
