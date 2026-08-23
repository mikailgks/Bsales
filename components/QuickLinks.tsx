export default function QuickLinks() {
  const links = [
    {
      title: "Bekijk producten",
      description: "Ontdek wat je vandaag kan claimen en verkopen.",
      href: "/producten",
      accent: "var(--gold)",
    },
    {
      title: "Ranglijst",
      description: "Zie wie er bovenaan staat en klim zelf mee.",
      href: "/#ranglijst",
      accent: "var(--teal)",
    },
    {
      title: "Maak een account",
      description: "Gratis registreren, direct starten met verkopen.",
      href: "/register",
      accent: "var(--ink)",
    },
  ];

  return (
    <section className="px-4 sm:px-6 py-14 bg-[var(--cream)]">
      <div className="max-w-5xl mx-auto grid sm:grid-cols-3 gap-5">
        {links.map((link) => (
          <a key={link.title} href={link.href} className="group block rounded-2xl bg-white border border-black/5 shadow-sm hover:shadow-lg transition p-6">
            <div className="w-10 h-1.5 rounded-full mb-4" style={{ backgroundColor: link.accent }} />
            <h3 className="font-display text-lg font-bold mb-1">{link.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{link.description}</p>
            <span className="text-sm font-semibold group-hover:underline">Ga ernaartoe →</span>
          </a>
        ))}
      </div>
    </section>
  );
}