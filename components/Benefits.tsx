export default function Benefits() {
  const benefits = [
    { title: "Behoud je volledige winst", description: "Het verschil tussen inkoop- en verkoopprijs is helemaal voor jou." },
    { title: "Geen ervaring nodig", description: "Iedereen kan starten, ongeacht achtergrond of ervaring." },
    { title: "Werk wanneer jij wilt", description: "Volledig flexibel, geen vaste uren of verplichtingen." },
    { title: "Stijg op de ranglijst", description: "Verdien badges, levels en XP terwijl je meer verkoopt." },
    { title: "Persoonlijk dashboard", description: "Volg je omzet, winst en statistieken overzichtelijk op één plek." },
    { title: "Betrouwbaar platform", description: "Veilige betalingen en bescherming van jouw gegevens." },
  ];

  return (
    <section className="px-4 sm:px-6 py-16 sm:py-24 bg-[var(--paper)]">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4 text-[var(--ink)]">Waarom Bsales?</h2>
        <p className="text-gray-600 mb-12 sm:mb-16 max-w-xl mx-auto">
          Alles wat je nodig hebt om succesvol te verkopen.
        </p>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 text-left">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="p-6 rounded-xl bg-white border border-[var(--border)] shadow-sm hover:shadow-md hover:border-[var(--accent)] transition">
              <div className="w-8 h-1 rounded-full mb-3 bg-[var(--accent)]" />
              <h3 className="font-display text-lg font-semibold mb-2 text-[var(--ink)]">{benefit.title}</h3>
              <p className="text-gray-600 text-sm">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}