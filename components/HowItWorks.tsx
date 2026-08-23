export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Registreer je gratis",
      description: "Maak in enkele minuten een account aan en krijg toegang tot je persoonlijke dashboard.",
    },
    {
      number: "02",
      title: "Kies je producten",
      description: "Bekijk het aanbod van Bsales en kies welke producten je wilt gaan verkopen.",
    },
    {
      number: "03",
      title: "Verkoop en verdien",
      description: "Verkoop de producten aan klanten en behoud het verschil als winst.",
    },
  ];

  return (
    <section className="px-4 sm:px-6 py-16 sm:py-24 bg-white">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4 text-[var(--ink)]">Hoe werkt het?</h2>
        <p className="text-gray-600 mb-12 sm:mb-16 max-w-xl mx-auto">
          In drie simpele stappen aan de slag met verdienen via Bsales.
        </p>

        <div className="grid sm:grid-cols-3 gap-10">
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col items-center">
              <div className="font-display text-5xl font-bold text-[var(--accent)]/20 mb-4">
                {step.number}
              </div>
              <h3 className="font-display text-xl font-semibold mb-2 text-[var(--ink)]">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}