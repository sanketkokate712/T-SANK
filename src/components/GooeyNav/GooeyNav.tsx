"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import "./GooeyNav.css";

interface GooeyNavItem {
    label: string;
    href: string;
}

interface GooeyNavProps {
    items: GooeyNavItem[];
    particleCount?: number;
    particleDistances?: [number, number];
    particleR?: number;
    initialActiveIndex?: number;
    animationTime?: number;
    timeVariance?: number;
    colors?: number[];
}

const colorPalette = ["#B71C1C", "#E53935", "#FF5252", "#ffffff"];

export default function GooeyNav({
    items,
    particleCount = 15,
    particleDistances = [90, 10],
    particleR = 100,
    initialActiveIndex = 0,
    animationTime = 600,
    timeVariance = 300,
    colors = [1, 2, 3, 1, 2, 3, 1, 4],
}: GooeyNavProps) {
    const [activeIndex, setActiveIndex] = useState(initialActiveIndex);
    const containerRef = useRef<HTMLDivElement>(null);
    const navRef = useRef<HTMLElement>(null);
    const filterRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

    const animateParticles = useCallback(
        (targetEl: HTMLLIElement) => {
            if (!filterRef.current || !textRef.current) return;

            const rect = targetEl.getBoundingClientRect();
            const navRect = navRef.current?.getBoundingClientRect();
            if (!navRect) return;

            const centerX = rect.left - navRect.left + rect.width / 2;
            const centerY = rect.top - navRect.top + rect.height / 2;

            // Position the effect layers
            filterRef.current.style.left = `${centerX}px`;
            filterRef.current.style.top = `${centerY}px`;
            filterRef.current.style.width = `${rect.width}px`;
            filterRef.current.style.height = `${rect.height}px`;

            textRef.current.style.left = `${centerX}px`;
            textRef.current.style.top = `${centerY}px`;
            textRef.current.style.width = `${rect.width}px`;
            textRef.current.style.height = `${rect.height}px`;

            // Clear old particles
            filterRef.current.querySelectorAll(".particle").forEach((p) => p.remove());

            // Create particles
            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement("span");
                particle.classList.add("particle");

                const angle = (Math.PI * 2 * i) / particleCount;
                const randDist = particleDistances[0] + Math.random() * (particleDistances[1] - particleDistances[0]);
                const startX = Math.cos(angle) * 10;
                const startY = Math.sin(angle) * 10;
                const endX = Math.cos(angle) * randDist;
                const endY = Math.sin(angle) * randDist;
                const rotate = (Math.random() - 0.5) * particleR;
                const scale = 0.5 + Math.random() * 1;
                const time = animationTime + (Math.random() - 0.5) * timeVariance;
                const colorIdx = colors[i % colors.length] - 1;
                const color = colorPalette[colorIdx] || colorPalette[0];

                particle.style.cssText = `
                    --start-x: ${startX}px;
                    --start-y: ${startY}px;
                    --end-x: ${endX}px;
                    --end-y: ${endY}px;
                    --rotate: ${rotate}deg;
                    --time: ${time}ms;
                `;

                const point = document.createElement("span");
                point.classList.add("point");
                point.style.cssText = `
                    --color: ${color};
                    --scale: ${scale};
                    --time: ${time}ms;
                `;

                particle.appendChild(point);
                filterRef.current.appendChild(particle);
            }

            // Remove particles after animation
            setTimeout(() => {
                filterRef.current?.querySelectorAll(".particle").forEach((p) => p.remove());
            }, animationTime + timeVariance + 200);
        },
        [particleCount, particleDistances, particleR, animationTime, timeVariance, colors]
    );

    const handleClick = useCallback(
        (e: React.MouseEvent, index: number) => {
            e.preventDefault();
            if (index === activeIndex) return;
            setActiveIndex(index);
            const target = itemRefs.current[index];
            if (target) animateParticles(target);

            // Scroll to section
            const href = items[index].href;
            if (href && href !== "#") {
                const el = document.querySelector(href);
                el?.scrollIntoView({ behavior: "smooth" });
            }
        },
        [activeIndex, items, animateParticles]
    );

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent, index: number) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleClick(e as unknown as React.MouseEvent, index);
            }
        },
        [handleClick]
    );

    // Position filter and text on initial active
    useEffect(() => {
        const target = itemRefs.current[activeIndex];
        if (target && filterRef.current && textRef.current && navRef.current) {
            const rect = target.getBoundingClientRect();
            const navRect = navRef.current.getBoundingClientRect();
            const cx = rect.left - navRect.left + rect.width / 2;
            const cy = rect.top - navRect.top + rect.height / 2;

            filterRef.current.style.left = `${cx}px`;
            filterRef.current.style.top = `${cy}px`;
            filterRef.current.style.width = `${rect.width}px`;
            filterRef.current.style.height = `${rect.height}px`;

            textRef.current.style.left = `${cx}px`;
            textRef.current.style.top = `${cy}px`;
            textRef.current.style.width = `${rect.width}px`;
            textRef.current.style.height = `${rect.height}px`;
        }
    }, [activeIndex]);

    return (
        <div className="gooey-nav-container" ref={containerRef}>
            <nav ref={navRef}>
                <ul>
                    {items.map((item, i) => (
                        <li
                            key={i}
                            ref={(el) => { itemRefs.current[i] = el; }}
                            className={i === activeIndex ? "active" : ""}
                            onClick={(e) => handleClick(e, i)}
                            onKeyDown={(e) => handleKeyDown(e, i)}
                            tabIndex={0}
                            role="button"
                        >
                            <a href={item.href} onClick={(e) => e.preventDefault()}>
                                {item.label}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
            <div ref={filterRef} className={`effect filter ${activeIndex >= 0 ? "active" : ""}`} />
            <div ref={textRef} className={`effect text ${activeIndex >= 0 ? "active" : ""}`} />
        </div>
    );
}
