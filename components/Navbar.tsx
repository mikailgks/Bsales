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
    <nav className="bg-black text-white">
      <div className="flex items-center justify-between px-4 sm:px-8 py-4">
        <a href="/" className="text-xl sm:text-2xl font-bold">Bsales</a>

        <div className="hidden md:flex gap-6">
          <a href="/producten" className="hover:text-gray-300">Producten</a>
          <a href="/#ranglijst" className="hover:text-gray-300">Ranglijst</a>
        </div>

        <div className="hidden md:flex gap-4">
          {!checked ? null : isLoggedIn ? (
            <a href="/dashboard" className="px-4 py-2 rounded-lg bg-white text-black font-semibold hover:bg-gray-200">
              Mijn dashboard
            </a>
          ) : (
            <>
              <a href="/login" className="px-4 py-2 rounded-lg hover:bg-gray-800">
                Inloggen
              </a>
              <a href="/register" className="px-4 py-2 rounded-lg bg-white text-black font-semibold hover:bg-gray-200">
                Registreren
              </a>
            </>
          )}
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-2xl"
          aria-label="Menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden flex flex-col gap-2 px-4 pb-4">
          <a href="/producten" className="py-2 hover:text-gray-300">Producten</a>
          <a href="/#ranglijst" className="py-2 hover:text-gray-300">Ranglijst</a>
          {!checked ? null : isLoggedIn ? (
            <a href="/dashboard" className="py-2 px-4 rounded-lg bg-white text-black font-semibold text-center mt-2">
              Mijn dashboard
            </a>
          ) : (
            <>
              <a href="/login" className="py-2 px-4 rounded-lg border border-gray-700 text-center mt-2">
                Inloggen
              </a>
              <a href="/register" className="py-2 px-4 rounded-lg bg-white text-black font-semibold text-center">
                Registreren
              </a>
            </>
          )}
        </div>
      )}
    </nav>
  );
}