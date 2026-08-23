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
    <section className="px-4 sm:px-6 py-16 sm:py-24 bg-gray-50">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">Waarom Bsales?</h2>
        <p className="text-gray-600 mb-12 sm:mb-16 max-w-xl mx-auto">
          Alles wat je nodig hebt om succesvol te verkopen.
        </p>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 text-left">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="p-6 rounded-xl bg-white shadow-sm hover:shadow-md transition">
              <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
              <p className="text-gray-600 text-sm">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}