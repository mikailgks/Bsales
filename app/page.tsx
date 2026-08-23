import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import QuickLinks from "@/components/QuickLinks";
import HowItWorks from "@/components/HowItWorks";
import Benefits from "@/components/Benefits";
import FeaturedProducts from "@/components/FeaturedProducts";
import LeaderboardPreview from "@/components/LeaderboardPreview";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <QuickLinks />
      <HowItWorks />
      <Benefits />
      <FeaturedProducts />
      <LeaderboardPreview />
      <FAQ />
      <Footer />
    </main>
  );
}