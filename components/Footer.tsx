import Link from "next/link";

export default function Footer() {
  return (
    <footer className="px-4 sm:px-6 py-10 sm:py-12 bg-[var(--ink)] text-gray-400">
      <div className="max-w-5xl mx-auto grid sm:grid-cols-3 gap-8 text-sm">
        <div>
          <div className="font-display text-white text-xl font-bold mb-3">Bsales</div>
          <p>Verkoop producten. Behoud je winst.</p>
        </div>
        <div>
          <div className="text-white font-semibold mb-3">Contact</div>
          <p>info@bsales.nl</p>
          <p>+32 000 00 00 00</p>
        </div>
        <div>
          <div className="text-white font-semibold mb-3">Links</div>
          <p><Link href="/faq" className="hover:text-[var(--accent)] transition">Veelgestelde vragen</Link></p>
          <p><Link href="/contact" className="hover:text-[var(--accent)] transition">Contact</Link></p>
          <p className="hover:text-[var(--accent)] transition cursor-pointer">Privacybeleid</p>
          <p className="hover:text-[var(--accent)] transition cursor-pointer">Algemene voorwaarden</p>
        </div>
      </div>
      <div className="max-w-5xl mx-auto mt-10 pt-6 border-t border-white/10 text-xs text-center">
        © 2026 Bsales. Alle rechten voorbehouden.
      </div>
    </footer>
  );
}