"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

export default function RegisterPage() {
  const params = useParams();
  const id = params.id as string;

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);

    await fetch("/api/registrations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tournamentId: id,
        name,
      }),
    });

    alert("Registration successful");
    setLoading(false);
  };

  return (
    <div className="min-h-screen p-20">
      <h1 className="text-3xl font-bold mb-6">
        Register for Tournament {id}
      </h1>

      <input
        type="text"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border px-4 py-2 mr-4"
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-purple-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
    </div>
  );
}