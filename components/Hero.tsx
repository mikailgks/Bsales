export default function Hero() {
  return (
    <section className="bg-[var(--ink)] text-white">
      <div className="flex flex-col items-center justify-center text-center px-6 py-20 md:py-28">
        <span className="font-display inline-block text-xs sm:text-sm tracking-widest uppercase text-[var(--gold)] border border-[var(--gold)]/40 rounded-full px-4 py-1 mb-6">
          Verkopen zonder eigen voorraad
        </span>
        <h1 className="font-display text-3xl sm:text-4xl md:text-6xl font-bold mb-6 max-w-3xl leading-tight">
          Verkoop producten. <span className="text-[var(--gold)]">Behoud je winst.</span>
        </h1>
        <p className="text-base md:text-xl text-gray-300 max-w-xl mb-8">
          Bsales geeft jou de kans om geld te verdienen door producten te verkopen. Registreer je gratis en begin vandaag nog.
        </p>
        <a href="#hoe-werkt-het" className="px-8 py-3 rounded-lg border border-white/30 hover:border-white hover:bg-white hover:text-[var(--ink)] transition text-center font-semibold">Hoe werkt het?</a>
      </div>

      <div className="border-t border-white/10 overflow-hidden py-3">
        <div className="flex ticker-track whitespace-nowrap">
          {[1, 2].map((rep) => (
            <div key={rep} className="flex gap-10 pr-10 text-sm text-gray-300 flex-shrink-0">
              <span>📦 Nieuwe producten elke week</span>
              <span>🏆 Klim de ranglijst op met elke verkoop</span>
              <span>⚡ Claim, verkoop, ontvang je winst</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}