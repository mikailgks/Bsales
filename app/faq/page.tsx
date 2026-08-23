import Navbar from "@/components/Navbar";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export default function FaqPage() {
  return (
    <main>
      <Navbar />
      <div className="pt-12">
        <FAQ />
      </div>
      <Footer />
    </main>
  );
}