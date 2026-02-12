export default function News() {
  return (
    <section className="py-20 bg-gray-100">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-10 text-gray-800">
          News & Updates
        </h2>

        <div className="grid md:grid-cols-2 gap-8">

          {/* News Card 1 */}
          <div className="relative rounded-xl overflow-hidden shadow-lg group cursor-pointer">
            <div
              className="h-64 bg-cover bg-center transform group-hover:scale-105 transition duration-500"
              style={{ backgroundImage: "url('/news1.jpg')" }}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="text-2xl font-bold">
                State Championship Announced
              </h3>
              <p className="mt-2 text-sm opacity-90">
                April 12, 2024
              </p>
              <p className="mt-2 text-sm opacity-90">
                Get ready for the biggest event of the year!
              </p>
            </div>
          </div>

          {/* News Card 2 */}
          <div className="relative rounded-xl overflow-hidden shadow-lg group cursor-pointer">
            <div
              className="h-64 bg-cover bg-center transform group-hover:scale-105 transition duration-500"
              style={{ backgroundImage: "url('/news2.jpg')" }}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="text-2xl font-bold">
                Tips to Improve Your Game
              </h3>
              <p className="mt-2 text-sm opacity-90">
                April 5, 2024
              </p>
              <p className="mt-2 text-sm opacity-90">
                Top strategies from professional coaches.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}