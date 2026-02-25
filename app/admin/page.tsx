"use client";

import { useEffect, useState } from "react";
import Popup from "@/components/Popup";

export default function AdminPage() {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [popupMessage, setPopupMessage] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      window.location.href = "/login";
      return;
    }

    fetchRegistrations();
    fetchTournaments();
  }, []);

  async function fetchRegistrations() {
    const res = await fetch("/api/registrations");
    const data = await res.json();
    setRegistrations(data);
  }

  async function fetchTournaments() {
    const res = await fetch("/api/tournaments");
    const data = await res.json();
    setTournaments(data);
  }

  async function createTournament() {
    const res = await fetch("/api/tournaments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        location,
        startDate,
        endDate,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setPopupMessage(data.error || "Error creating tournament");
      return;
    }

    setPopupMessage("Tournament Created Successfully!");

    setTitle("");
    setLocation("");
    setStartDate("");
    setEndDate("");

    fetchTournaments();
  }

  return (
    <div className="min-h-screen p-16 bg-gray-50 space-y-12">
      <h1 className="text-4xl font-bold">Admin Dashboard</h1>

      {/* CREATE TOURNAMENT */}
      <div className="bg-white p-6 rounded shadow space-y-4">
        <h2 className="text-2xl font-semibold">Create Tournament</h2>

        <div className="grid grid-cols-2 gap-4">
          <input
            placeholder="Tournament Title"
            className="border p-3 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            placeholder="Location"
            className="border p-3 rounded"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <input
            type="date"
            className="border p-3 rounded"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <input
            type="date"
            className="border p-3 rounded"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <button
          onClick={createTournament}
          className="bg-orange-500 text-white px-6 py-3 rounded hover:bg-orange-600"
        >
          Create Tournament
        </button>
      </div>

      {/* TOURNAMENT LIST */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-semibold mb-4">Created Tournaments</h2>

        {tournaments.length === 0 ? (
          <p>No tournaments yet.</p>
        ) : (
          <ul className="space-y-2">
            {tournaments.map((t: any) => (
              <li key={t.id} className="border p-3 rounded bg-gray-50">
                <strong>{t.title}</strong> — {t.location} <br />
                {t.startDate} to {t.endDate}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* REGISTRATIONS */}
      <div className="bg-white p-6 rounded shadow overflow-x-auto">
        <h2 className="text-2xl font-semibold mb-4">Player Registrations</h2>

        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Gender</th>
              <th className="p-3 border">District</th>
              <th className="p-3 border">Category</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((r: any) => (
              <tr key={r.id}>
                <td className="p-3 border">
                  {r.firstName} {r.lastName}
                </td>
                <td className="p-3 border">{r.gender}</td>
                <td className="p-3 border">{r.district}</td>
                <td className="p-3 border">{r.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {popupMessage && (
        <Popup
          message={popupMessage}
          onClose={() => setPopupMessage("")}
        />
      )}
    </div>
  );
}