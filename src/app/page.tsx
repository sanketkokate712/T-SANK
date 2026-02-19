import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProductGrid from "@/components/ProductGrid";
import ParallaxBanner from "@/components/ParallaxBanner";
import FeaturedCollection from "@/components/FeaturedCollection";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import BackToTop from "@/components/BackToTop";
import RevealOnScroll from "@/components/RevealOnScroll";
import GooeyNav from "@/components/GooeyNav/GooeyNav";
import FuzzyText from "@/components/FuzzyText";

import ScrollFloat from "@/components/ScrollFloat/ScrollFloat";
import FlowingMenu from "@/components/FlowingMenu/FlowingMenu";

const flowingMenuItems = [
  { link: "#", text: "Autobots", image: "/images/transformer-sequence/30.jpg" },
  { link: "#", text: "Decepticons", image: "/images/transformer-sequence/60.jpg" },
  { link: "#", text: "New Arrivals", image: "/images/transformer-sequence/90.jpg" },
  { link: "#", text: "Best Sellers", image: "/images/transformer-sequence/120.jpg" },
];

const gooeyItems = [
  { label: "Home", href: "#" },
  { label: "Collection", href: "#collection" },
  { label: "Shop", href: "#shop" },
  { label: "Shop", href: "#shop" },
  { label: "Custom", href: "/custom-design" },
  { label: "About", href: "#about" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Home() {
  return (
    <SmoothScroll>
      <main className="bg-base-dark min-h-screen">
        <Navbar />

        {/* Screen-reader summary */}
        <div className="sr-only" role="region" aria-label="Store Description">
          <h1>T-SANK — Premium Transformers Merchandise by Sanket Kokate</h1>
          <p>
            A scroll-driven transformation sequence followed by a curated
            collection of Transformers t-shirts for students and fans.
          </p>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            HERO — scroll-driven transformer sequence
        ═══════════════════════════════════════════════════════════════ */}
        <HeroSection />

        {/* ═══════════════════════════════════════════════════════════════
            FEATURED PICKS
        ═══════════════════════════════════════════════════════════════ */}
        <RevealOnScroll>
          <FeaturedCollection />
        </RevealOnScroll>

        {/* ═══════════════════════════════════════════════════════════════
            PARALLAX 1 — Choose Your Faction
        ═══════════════════════════════════════════════════════════════ */}
        <ParallaxBanner
          imageSrc="/images/transformer-sequence/90.jpg"
          title="CHOOSE YOUR FACTION"
          subtitle="Autobots or Decepticons"
        />

        {/* ═══════════════════════════════════════════════════════════════
            PRODUCT GRID with ScrollFloat heading
        ═══════════════════════════════════════════════════════════════ */}
        <section className="py-8 md:py-12">
          <div className="flex justify-center pt-8 md:pt-12 pb-2">
            <ScrollFloat
              animationDuration={1}
              ease="back.inOut(2)"
              scrollStart="center bottom+=50%"
              scrollEnd="bottom bottom-=40%"
              stagger={0.03}
              containerClassName="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-widest font-[family-name:var(--font-heading)]"
            >
              OUR COLLECTION
            </ScrollFloat>
          </div>
          <p className="text-center text-text-secondary text-sm md:text-base tracking-wider max-w-xl mx-auto px-6 mb-4">
            Premium designs, 100% cotton, built to last. Every tee tells a story.
          </p>
          <RevealOnScroll>
            <ProductGrid />
          </RevealOnScroll>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            PARALLAX 2 — Wear the Power
        ═══════════════════════════════════════════════════════════════ */}
        <ParallaxBanner
          imageSrc="/images/transformer-sequence/150.jpg"
          title="WEAR THE POWER"
          subtitle="Premium student merch"
        />

        {/* ═══════════════════════════════════════════════════════════════
            INTERACTIVE NAV + BRAND SECTION
            Combined GooeyNav + FuzzyText into one cohesive section
        ═══════════════════════════════════════════════════════════════ */}
        <section className="py-12 md:py-20">
          {/* Fuzzy Brand Name */}
          <div className="flex justify-center items-center pb-6 md:pb-10">
            <FuzzyText
              baseIntensity={0.2}
              hoverIntensity={0.5}
              enableHover
            >
              T-SANK
            </FuzzyText>
          </div>

          {/* Tagline */}
          <p className="text-center text-text-secondary text-xs md:text-sm tracking-[0.3em] uppercase mb-8 md:mb-12 px-6">
            Transform your style — discover every section below
          </p>

          {/* Gooey Nav */}
          <div className="flex justify-center items-center relative" style={{ height: "80px" }}>
            <GooeyNav
              items={gooeyItems}
              particleCount={15}
              particleDistances={[90, 10]}
              particleR={100}
              initialActiveIndex={0}
              animationTime={600}
              timeVariance={300}
              colors={[1, 2, 3, 1, 2, 3, 1, 4]}
            />
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            MID-PAGE CTA — call to action strip
        ═══════════════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden py-12 md:py-16">
          <div className="absolute inset-0 bg-gradient-to-r from-accent-red/10 via-accent-red/5 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-base-dark via-transparent to-base-dark" />
          <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
            <ScrollFloat
              animationDuration={1}
              ease="back.inOut(2)"
              scrollStart="center bottom+=50%"
              scrollEnd="bottom bottom-=40%"
              stagger={0.03}
              containerClassName="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-widest font-[family-name:var(--font-heading)]"
            >
              MORE THAN MERCH
            </ScrollFloat>
            <p className="text-text-secondary text-sm md:text-base tracking-wider max-w-lg mx-auto mt-4 mb-6 leading-relaxed">
              Every design is hand-crafted with obsessive detail. From the inks we choose to the fabric
              we source — this is premium gear for real fans.
            </p>
            <a
              href="#shop"
              className="inline-block font-[family-name:var(--font-heading)] text-[11px] md:text-[12px] tracking-[0.25em] bg-accent-red hover:bg-accent-red-bright text-white px-8 md:px-10 py-3 md:py-3.5 transition-all duration-400 hover:shadow-[0_0_30px_rgba(183,28,28,0.5)]"
            >
              EXPLORE NOW
            </a>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            TESTIMONIALS with ScrollFloat heading
        ═══════════════════════════════════════════════════════════════ */}
        <section className="py-8 md:py-12">
          <div className="flex justify-center pt-8 md:pt-12 pb-2">
            <ScrollFloat
              animationDuration={1}
              ease="back.inOut(2)"
              scrollStart="center bottom+=50%"
              scrollEnd="bottom bottom-=40%"
              stagger={0.03}
              containerClassName="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-widest font-[family-name:var(--font-heading)]"
            >
              WHAT FANS SAY
            </ScrollFloat>
          </div>
          <p className="text-center text-text-secondary text-sm md:text-base tracking-wider max-w-xl mx-auto px-6 mb-4">
            Don&apos;t take our word for it — hear from the community.
          </p>
          <RevealOnScroll>
            <TestimonialCarousel />
          </RevealOnScroll>
        </section>


        {/* ═══════════════════════════════════════════════════════════════
            CUSTOM DESIGNER — design your own t-shirt
        ═══════════════════════════════════════════════════════════════ */}


        {/* ═══════════════════════════════════════════════════════════════
            FLOWING MENU — category navigation
        ═══════════════════════════════════════════════════════════════ */}
        <section>
          <div className="flex justify-center pt-12 md:pt-16 pb-4">
            <ScrollFloat
              animationDuration={1}
              ease="back.inOut(2)"
              scrollStart="center bottom+=50%"
              scrollEnd="bottom bottom-=40%"
              stagger={0.03}
              containerClassName="text-white text-2xl sm:text-3xl md:text-4xl font-bold tracking-widest font-[family-name:var(--font-heading)]"
            >
              EXPLORE CATEGORIES
            </ScrollFloat>
          </div>
          <div style={{ height: "500px", position: "relative" }}>
            <FlowingMenu
              items={flowingMenuItems}
              speed={15}
              textColor="#ffffff"
              bgColor="#0a0a0a"
              marqueeBgColor="#ffffff"
              marqueeTextColor="#0a0a0a"
              borderColor="#333333"
            />
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            ABOUT with ScrollFloat heading
        ═══════════════════════════════════════════════════════════════ */}
        <section className="pt-8 md:pt-12">
          <div className="flex justify-center pb-2">
            <ScrollFloat
              animationDuration={1}
              ease="back.inOut(2)"
              scrollStart="center bottom+=50%"
              scrollEnd="bottom bottom-=40%"
              stagger={0.03}
              containerClassName="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-widest font-[family-name:var(--font-heading)]"
            >
              OUR STORY
            </ScrollFloat>
          </div>
          <RevealOnScroll>
            <AboutSection />
          </RevealOnScroll>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            FOOTER
        ═══════════════════════════════════════════════════════════════ */}
        <Footer />

        {/* Back to Top */}
        <BackToTop />
      </main>
    </SmoothScroll>
  );
}
