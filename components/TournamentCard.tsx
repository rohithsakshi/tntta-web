"use client";

import { motion } from "framer-motion";

export type Tournament = {
  name: string;
  date: string;
  location: string;
  image: string;
};

export default function TournamentCard({
  tournament,
}: {
  tournament: Tournament;
}) {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
    >
      {/* Image */}
      <div className="relative h-60 overflow-hidden">
        <img
          src={tournament.image}
          alt={tournament.name}
          className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Date badge */}
        <span className="absolute top-4 left-4 bg-orange-500 text-white text-xs px-4 py-1 rounded-full shadow-md group-hover:scale-110 transition">
          {tournament.date}
        </span>
      </div>

      {/* Content */}
      <div className="absolute bottom-6 left-6 text-white">
        <h3 className="text-xl font-semibold mb-1">
          {tournament.name}
        </h3>
        <p className="text-sm opacity-80">
          {tournament.location}
        </p>

        {/* CTA on hover */}
        <span className="opacity-0 group-hover:opacity-100 transition duration-300 text-orange-400 text-sm mt-2 inline-block">
          View Details →
        </span>
      </div>
    </motion.div>
  );
}