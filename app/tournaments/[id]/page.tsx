import { tournaments } from "@/app/lib/tournaments";
import Link from "next/link";

export default async function TournamentDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const tournament = tournaments.find((t) => t.id === id);

  if (!tournament) {
    return <div className="p-20">Tournament not found</div>;
  }

  return (
    <div className="min-h-screen p-20">
      <h1 className="text-4xl font-bold mb-4">{tournament.name}</h1>
      <p className="mb-2">Location: {tournament.location}</p>
      <p className="mb-6">Date: {tournament.date}</p>

      <Link
        href={`/tournaments/${id}/register`}
        className="bg-blue-600 text-white px-6 py-3 rounded"
      >
        Register Now
      </Link>
    </div>
  );
}