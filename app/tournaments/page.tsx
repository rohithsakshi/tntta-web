"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Tournament = {
  id: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
};

type Application = {
  tournamentId: string;
  playerName: string;
};

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser);

    fetchTournaments();
    fetchApplications();
  }, []);

  const fetchTournaments = async () => {
    const res = await fetch("/api/tournaments");
    const data = await res.json();
    setTournaments(data);
  };

  const fetchApplications = async () => {
    const res = await fetch("/api/applications");
    const data = await res.json();
    setApplications(data);
  };

  const hasApplied = (tournamentId: string) => {
    if (!user) return false;

    return applications.some(
      (app) =>
        app.tournamentId === tournamentId &&
        app.playerName === user
    );
  };

  return (
    <div className="min-h-screen p-20">
      <h1 className="text-3xl font-bold mb-10">All Tournaments</h1>

      <div className="space-y-6">
        {tournaments.length === 0 ? (
          <p>No tournaments available.</p>
        ) : (
          tournaments.map((t) => (
            <div
              key={t.id}
              className="border p-6 rounded-lg flex justify-between items-center"
            >
              <div>
                <h2 className="text-xl font-semibold">{t.title}</h2>
                <p className="text-gray-600">{t.location}</p>
                <p className="text-gray-500">
                  {t.startDate} to {t.endDate}
                </p>
              </div>

              {hasApplied(t.id) ? (
                <span className="px-5 py-2 bg-green-600 text-white rounded">
                  Applied
                </span>
              ) : (
                <Link
                  href={`/tournaments/${t.id}`}
                  className="bg-blue-600 text-white px-5 py-2 rounded"
                >
                  View
                </Link>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}