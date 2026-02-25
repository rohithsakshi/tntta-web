"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

export type Tournament = {
  id: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
};

export default function TournamentCard({
  tournament,
}: {
  tournament: Tournament;
}) {

  const [applied, setApplied] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) return;

    fetch("/api/applications")
      .then(res => res.json())
      .then(data => {
        const alreadyApplied = data.some(
          (app: any) =>
            app.tournamentId === tournament.id &&
            app.playerName === user
        );

        setApplied(alreadyApplied);
      });
  }, [tournament.id]);

  return (
    <motion.div
      whileHover={{ y: -10 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 bg-black text-white"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800" />

      <div className="relative p-8 h-60 flex flex-col justify-between">
        <span className="bg-orange-500 text-white text-xs px-4 py-1 rounded-full shadow-md w-fit">
          {tournament.startDate} → {tournament.endDate}
        </span>

        <div>
          <h3 className="text-xl font-semibold mb-1">
            {tournament.title}
          </h3>

          <p className="text-sm opacity-80 mb-4">
            📍 {tournament.location}
          </p>

          {applied ? (
            <span className="px-4 py-2 rounded text-sm bg-green-600 inline-block">
              Applied
            </span>
          ) : (
            <Link
              href={`/tournaments/${tournament.id}/register`}
              className="px-4 py-2 rounded text-sm bg-green-500 hover:bg-green-600 transition inline-block"
            >
              Apply Now
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}