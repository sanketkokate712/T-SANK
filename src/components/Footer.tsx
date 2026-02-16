"use client";

import { STORE, NAV_LINKS } from "@/data/products";

export default function Footer() {
    return (
        <footer id="contact" className="relative bg-base-darker pt-20 pb-8 px-6 md:px-10">
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent-red/30 to-transparent" />

            <div className="max-w-7xl mx-auto">
                {/* Main Footer Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="sm:col-span-2 lg:col-span-1" data-aos="fade-up" data-aos-delay="0">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="relative w-10 h-10 flex items-center justify-center">
                                <div className="absolute inset-0 border-2 border-accent-red rotate-45" />
                                <div className="absolute inset-1 border border-accent-red/30 rotate-45" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-[family-name:var(--font-heading)] text-lg font-bold tracking-[0.15em] text-white leading-none">
                                    {STORE.name}
                                </span>
                                <span className="font-[family-name:var(--font-body)] text-[9px] tracking-[0.35em] text-text-muted uppercase leading-none mt-1">
                                    BY {STORE.owner.toUpperCase()}
                                </span>
                            </div>
                        </div>
                        <p className="font-[family-name:var(--font-body)] text-sm text-text-muted leading-relaxed tracking-wide max-w-xs">
                            {STORE.description}
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div data-aos="fade-up" data-aos-delay="100">
                        <h4 className="font-[family-name:var(--font-heading)] text-[11px] tracking-[0.35em] text-text-secondary uppercase mb-5">
                            Quick Links
                        </h4>
                        <ul className="space-y-3">
                            {NAV_LINKS.map((link) => (
                                <li key={link.href}>
                                    <a
                                        href={link.href}
                                        className="font-[family-name:var(--font-body)] text-sm text-text-muted hover:text-accent-red transition-colors duration-300 tracking-wider"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div data-aos="fade-up" data-aos-delay="200">
                        <h4 className="font-[family-name:var(--font-heading)] text-[11px] tracking-[0.35em] text-text-secondary uppercase mb-5">
                            Support
                        </h4>
                        <ul className="space-y-3 font-[family-name:var(--font-body)] text-sm text-text-muted tracking-wider">
                            <li><a href="#" className="hover:text-accent-red transition-colors duration-300">Size Guide</a></li>
                            <li><a href="#" className="hover:text-accent-red transition-colors duration-300">Shipping Info</a></li>
                            <li><a href="#" className="hover:text-accent-red transition-colors duration-300">Returns & Exchange</a></li>
                            <li><a href="#" className="hover:text-accent-red transition-colors duration-300">FAQ</a></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div data-aos="fade-up" data-aos-delay="300">
                        <h4 className="font-[family-name:var(--font-heading)] text-[11px] tracking-[0.35em] text-text-secondary uppercase mb-5">
                            Stay Updated
                        </h4>
                        <p className="font-[family-name:var(--font-body)] text-sm text-text-muted tracking-wider mb-4">
                            Get early access to new drops & exclusive deals.
                        </p>
                        <div className="flex">
                            <input
                                type="email"
                                placeholder="your@email.com"
                                className="flex-1 bg-neutral-carbon border border-neutral-800 px-4 py-2.5 text-sm text-white font-[family-name:var(--font-body)] tracking-wider focus:outline-none focus:border-accent-red/50 transition-colors placeholder:text-text-muted"
                            />
                            <button className="bg-accent-red hover:bg-accent-red-bright px-4 py-2.5 font-[family-name:var(--font-heading)] text-[10px] tracking-[0.2em] text-white transition-colors duration-300">
                                JOIN
                            </button>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-[1px] bg-neutral-800/50 mb-8" />

                {/* Bottom Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <span className="font-[family-name:var(--font-body)] text-[11px] tracking-[0.2em] text-text-muted">
                        © {new Date().getFullYear()} {STORE.name} BY {STORE.owner.toUpperCase()}. ALL RIGHTS RESERVED.
                    </span>
                    <div className="flex gap-6">
                        <a href="#" className="font-[family-name:var(--font-body)] text-[11px] tracking-[0.15em] text-text-muted hover:text-accent-red transition-colors duration-300">
                            INSTAGRAM
                        </a>
                        <a href="#" className="font-[family-name:var(--font-body)] text-[11px] tracking-[0.15em] text-text-muted hover:text-accent-red transition-colors duration-300">
                            TWITTER
                        </a>
                        <a href="#" className="font-[family-name:var(--font-body)] text-[11px] tracking-[0.15em] text-text-muted hover:text-accent-red transition-colors duration-300">
                            DISCORD
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
