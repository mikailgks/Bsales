export default function Footer() {
  return (
    <footer className="px-6 py-12 bg-black text-gray-400">
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 text-sm">
        <div>
          <div className="text-white text-xl font-bold mb-3">Bsales</div>
          <p>Verkoop producten. Behoud je winst.</p>
        </div>

        <div>
          <div className="text-white font-semibold mb-3">Contact</div>
          <p>info@bsales.com</p>
          <p>+32 000 00 00 00</p>
        </div>

        <div>
          <div className="text-white font-semibold mb-3">Links</div>
          <p className="hover:text-white cursor-pointer">Privacybeleid</p>
          <p className="hover:text-white cursor-pointer">Algemene voorwaarden</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-10 pt-6 border-t border-gray-800 text-xs text-center">
        © 2026 Bsales. Alle rechten voorbehouden.
      </div>
    </footer>
  );
}