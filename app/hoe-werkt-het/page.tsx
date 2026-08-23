import Navbar from "@/components/Navbar";
import HowItWorks from "@/components/HowItWorks";
import Benefits from "@/components/Benefits";
import Footer from "@/components/Footer";

export default function HoeWerktHetPage() {
  return (
    <main>
      <Navbar />
      <div className="pt-12">
        <HowItWorks />
        <Benefits />
      </div>
      <Footer />
    </main>
  );
}