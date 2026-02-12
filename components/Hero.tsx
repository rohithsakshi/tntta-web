"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const slides = [
  {
    image: "/hero-1.jpg",
    title: "Upcoming Tournaments",
    subtitle: "Manage. Compete. Win – All in One Place.",
  },
  {
    image: "/hero-2.jpg",
    title: "State Level Championships",
    subtitle: "Competing Across Tamil Nadu.",
  },
  {
    image: "/hero-3.jpg",
    title: "Table Tennis Excellence",
    subtitle: "Precision. Power. Performance.",
  },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[380px] overflow-hidden">

      {/* Slides */}
      {slides.map((slide, index) => (
  <img
    key={index}
    src={slide.image}
    alt={slide.title}
    className={`absolute inset-0 w-full h-full object-cover object-[70%_center] transition-opacity duration-1000 ${
      index === current ? "opacity-100" : "opacity-0"
    }`}
  />
))}

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center px-20 text-white">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold mb-3">
            {slides[current].title}
          </h1>

          <p className="mb-6 text-lg">
            {slides[current].subtitle}
          </p>

          <div className="flex gap-4 flex-wrap">
            <Link
              href="/register"
              className="bg-orange-500 px-6 py-2 rounded-md hover:bg-orange-600 transition"
            >
              Register
            </Link>

            <Link
              href="/rankings"
              className="bg-blue-600 px-6 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Rankings
            </Link>

            <Link
              href="/results"
              className="bg-green-600 px-6 py-2 rounded-md hover:bg-green-700 transition"
            >
              Results
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}