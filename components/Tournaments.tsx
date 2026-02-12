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
    <section className="px-20 py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl font-bold text-gray-800">
            Upcoming Tournaments
          </h2>
          <a
            href="/tournaments"
            className="text-blue-600 font-medium hover:underline"
          >
            View All →
          </a>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {tournaments.map((tournament, index) => (
            <div
              key={index}
              className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition duration-500 overflow-hidden transform hover:-translate-y-2"
            >
              {/* Image Section */}
              <div className="relative h-52 overflow-hidden">
                
                {/* Image */}
                <img
                  src={tournament.image}
                  alt={tournament.name}
                  className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                {/* Date Badge */}
                <span className="absolute bottom-4 left-4 bg-black/70 text-white text-sm px-4 py-1 rounded-full backdrop-blur-sm group-hover:bg-blue-600 transition">
                  {tournament.date}
                </span>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-semibold text-lg text-gray-800 mb-2 group-hover:text-blue-600 transition">
                  {tournament.name}
                </h3>
                <p className="text-gray-500 text-sm">
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