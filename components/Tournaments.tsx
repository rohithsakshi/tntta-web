import TournamentCard, { Tournament } from "./TournamentCard";

export default function Tournaments({
  tournaments,
}: {
  tournaments: Tournament[];
}) {
  return (
    <section className="px-20 py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">
            Upcoming Tournaments
          </h2>

          <a
            href="/tournaments"
            className="text-blue-600 font-medium hover:text-orange-500 transition"
          >
            View All →
          </a>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {tournaments.map((tournament, index) => (
            <TournamentCard
              key={index}
              tournament={tournament}
            />
          ))}
        </div>
      </div>
    </section>
  );
}