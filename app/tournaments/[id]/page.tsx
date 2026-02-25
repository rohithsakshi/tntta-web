import Link from "next/link";

async function getTournament(id: string) {
  const res = await fetch("http://localhost:3000/api/tournaments", {
    cache: "no-store",
  });

  if (!res.ok) return null;

  const tournaments = await res.json();
  return tournaments.find((t: any) => t.id === id);
}

export default async function TournamentDetail({
  params,
}: {
  params: { id: string };
}) {
  const tournament = await getTournament(params.id);

  if (!tournament) {
    return <div className="p-20">Tournament not found</div>;
  }

  return (
    <div className="min-h-screen p-20">
      <h1 className="text-4xl font-bold mb-4">{tournament.title}</h1>
      <p className="mb-2">Location: {tournament.location}</p>
      <p className="mb-6">
        {tournament.startDate} to {tournament.endDate}
      </p>

      <Link
        href={`/tournaments/${tournament.id}/register`}
        className="bg-blue-600 text-white px-6 py-3 rounded"
      >
        Register Now
      </Link>
    </div>
  );
}