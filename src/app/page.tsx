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

        {/* Scroll-driven Hero with transformer sequence + info pop-ups */}
        <HeroSection />

        {/* Featured Picks */}
        <RevealOnScroll>
          <FeaturedCollection />
        </RevealOnScroll>


        {/* Parallax Banner */}
        <ParallaxBanner
          imageSrc="/images/transformer-sequence/90.jpg"
          title="CHOOSE YOUR FACTION"
          subtitle="Autobots or Decepticons"
        />

        {/* Product Grid */}
        <RevealOnScroll>
          <ProductGrid />
        </RevealOnScroll>

        {/* Parallax Banner 2 */}
        <ParallaxBanner
          imageSrc="/images/transformer-sequence/150.jpg"
          title="WEAR THE POWER"
          subtitle="Premium student merch"
        />


        {/* Testimonials */}
        <RevealOnScroll>
          <TestimonialCarousel />
        </RevealOnScroll>

        {/* About */}
        <RevealOnScroll>
          <AboutSection />
        </RevealOnScroll>


        {/* Footer */}
        <Footer />

        {/* Back to Top */}
        <BackToTop />
      </main>
    </SmoothScroll>
  );
}
