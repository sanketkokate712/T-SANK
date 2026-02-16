"use client";

import dynamic from "next/dynamic";

const Lanyard = dynamic(() => import("@/components/Lanyard/Lanyard"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-[80vh] flex items-center justify-center">
            <div className="text-white/30 text-sm tracking-widest animate-pulse">
                LOADING 3D...
            </div>
        </div>
    ),
});

interface LanyardSectionProps {
    position?: [number, number, number];
    gravity?: [number, number, number];
}

export default function LanyardSection({
    position = [0, 0, 24],
    gravity = [0, -40, 0],
}: LanyardSectionProps) {
    return <Lanyard position={position} gravity={gravity} />;
}
