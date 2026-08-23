"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checked, setChecked] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setIsLoggedIn(!!data.user);
      setChecked(true);
    });
  }, []);

  return (
    <nav className="bg-[var(--ink)] text-white">
      <div className="flex items-center justify-between gap-3 px-4 sm:px-8 py-4">
        <a href="/" className="font-display text-xl sm:text-2xl font-bold flex-shrink-0">Bsales</a>

        <div className="hidden md:flex gap-6">
          <a href="/producten" className="hover:text-[var(--gold)] transition">Producten</a>
          <a href="/#ranglijst" className="hover:text-[var(--gold)] transition">Ranglijst</a>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {!checked ? null : isLoggedIn ? (
            <a href="/dashboard" className="px-3 sm:px-4 py-2 rounded-lg bg-[var(--gold)] text-[var(--ink)] text-sm sm:text-base font-semibold hover:bg-[var(--gold-dark)] transition whitespace-nowrap">Dashboard</a>
          ) : (
            <>
              <a href="/login" className="px-3 sm:px-4 py-2 rounded-lg hover:bg-white/10 transition text-sm sm:text-base whitespace-nowrap">Inloggen</a>
              <a href="/register" className="px-3 sm:px-4 py-2 rounded-lg bg-[var(--gold)] text-[var(--ink)] text-sm sm:text-base font-semibold hover:bg-[var(--gold-dark)] transition whitespace-nowrap">Registreren</a>
            </>
          )}

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-2xl flex-shrink-0" aria-label="Menu">
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden flex flex-col gap-1 px-4 pb-4">
          <a href="/producten" className="py-2 hover:text-[var(--gold)] transition">Producten</a>
          <a href="/#ranglijst" className="py-2 hover:text-[var(--gold)] transition">Ranglijst</a>
        </div>
      )}
    </nav>
  );
}