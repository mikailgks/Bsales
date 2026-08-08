"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setIsLoggedIn(!!data.user);
      setChecked(true);
    });
  }, []);

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-black text-white">
      <a href="/" className="text-2xl font-bold">Bsales</a>
      <div className="flex gap-6">
        <a href="/producten" className="hover:text-gray-300">Producten</a>
        <a href="/#ranglijst" className="hover:text-gray-300">Ranglijst</a>
      </div>
      <div className="flex gap-4">
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
    </nav>
  );
}