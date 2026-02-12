type Tournament = {
  name: string;
  date: string;
  location: string;
  image: string;
};

export default function Tournaments({
  tournaments,
}: {
  tournaments: Tournament[];
}) {
  return (
    <section className="px-16 py-12 bg-white">
      <div className="max-w-6xl mx-auto">

        {/* Header Row */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-semibold text-gray-800">
            Upcoming Tournaments
          </h2>

          <button className="text-sm text-blue-600 font-medium hover:underline">
            View All →
          </button>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tournaments.map((tournament, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100"
            >
              {/* Image */}
              <div
                className="h-36 bg-cover bg-center relative"
                style={{
                  backgroundImage: `url(${tournament.image})`,
                }}
              >
                {/* Date Badge */}
                <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-3 py-1 rounded">
                  {tournament.date}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-sm text-gray-800 mb-1">
                  {tournament.name}
                </h3>

                <p className="text-gray-500 text-xs">
                  {tournament.location}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}