import Link from "next/link";
import { tournaments } from "@/app/lib/tournaments";

export default function TournamentsPage() {
  return (
    <div className="min-h-screen p-20">
      <h1 className="text-3xl font-bold mb-10">
        All Tournaments
      </h1>

      <div className="space-y-6">
        {tournaments.map((tournament) => (
          <div
            key={tournament.id}
            className="border p-6 rounded-lg flex justify-between items-center"
          >
            <div>
              <h2 className="text-xl font-semibold">
                {tournament.name}
              </h2>
              <p className="text-gray-500">
                {tournament.date}, {tournament.location}
              </p>
            </div>

            <Link
              href={`/tournaments/${tournament.id}`}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}