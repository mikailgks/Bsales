export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center text-center px-6 py-32 bg-gradient-to-b from-black to-gray-900 text-white">
      <h1 className="text-5xl md:text-6xl font-bold mb-6 max-w-3xl">
        Verkoop producten. Behoud je winst.
      </h1>
      <p className="text-lg md:text-xl text-gray-300 max-w-xl mb-10">
        Bsales geeft jou de kans om geld te verdienen door producten te verkopen.
        Registreer je gratis en begin vandaag nog.
      </p>
      <div className="flex gap-4">
        <button className="px-8 py-3 rounded-lg bg-white text-black font-semibold hover:bg-gray-200 transition">
          Nu registreren
        </button>
        <button className="px-8 py-3 rounded-lg border border-white hover:bg-white hover:text-black transition">
          Hoe werkt het?
        </button>
      </div>
    </section>
  );
}