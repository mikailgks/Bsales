export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center text-center px-6 py-20 md:py-32 bg-gradient-to-b from-black to-gray-900 text-white">
      <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 max-w-3xl">
        Verkoop producten. Behoud je winst.
      </h1>
      <p className="text-base md:text-xl text-gray-300 max-w-xl mb-10">
        Bsales geeft jou de kans om geld te verdienen door producten te verkopen.
        Registreer je gratis en begin vandaag nog.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4 sm:px-0">
        
          href="/register"
          className="px-8 py-3 rounded-lg bg-white text-black font-semibold hover:bg-gray-200 transition text-center"
        >
          Nu registreren
        </a>
        
          href="#hoe-werkt-het"
          className="px-8 py-3 rounded-lg border border-white hover:bg-white hover:text-black transition text-center"
        >
          Hoe werkt het?
        </a>
      </div>
    </section>
  );
}