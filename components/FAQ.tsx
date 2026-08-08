"use client";
import { useState } from "react";

export default function FAQ() {
  const faqs = [
    {
      question: "Hoe verdien ik geld met Bsales?",
      answer:
        "Je koopt producten in tegen de inkoopprijs en verkoopt ze door aan klanten. Het verschil tussen inkoop- en verkoopprijs is jouw winst, die je volledig mag houden.",
    },
    {
      question: "Kost het geld om te registreren?",
      answer:
        "Nee, registreren bij Bsales is volledig gratis. Je kan direct na registratie beginnen met verkopen.",
    },
    {
      question: "Hoe werkt de ranglijst?",
      answer:
        "Hoe meer je verkoopt, hoe hoger je op de ranglijst komt. Je verdient XP, badges en levels naarmate je meer verkopen behaalt.",
    },
    {
      question: "Kan ik op elk moment stoppen?",
      answer:
        "Ja, je bent volledig vrij om te werken wanneer jij wilt. Er zijn geen vaste uren of verplichtingen.",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="px-6 py-24 bg-white">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-4xl font-bold mb-12 text-center">
          Veelgestelde vragen
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={faq.question}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex justify-between items-center px-6 py-4 text-left font-medium hover:bg-gray-50 transition"
              >
                {faq.question}
                <span className="text-xl">
                  {openIndex === index ? "−" : "+"}
                </span>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4 text-gray-600 text-sm">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}