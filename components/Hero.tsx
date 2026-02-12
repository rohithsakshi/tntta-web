export default function Hero() {
  return (
    <div
      className="relative h-[380px] bg-cover bg-center overflow-hidden"
      style={{
        backgroundImage: "url('/hero-main.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-blue-900/70" />

      <div className="relative z-10 px-16 py-20 text-white">
        <div className="bg-blue-800/80 inline-block px-8 py-6 rounded-lg">
          <h1 className="text-4xl font-bold mb-2">
            Chennai Open 2024
          </h1>

          <p className="mb-6 text-lg">
            May 12–15 · Chennai
          </p>

          <div className="flex gap-4">
            <button className="bg-orange-500 px-6 py-2 rounded-md hover:bg-orange-600 transition">
              Register Now
            </button>

            <button className="bg-blue-500 px-6 py-2 rounded-md hover:bg-blue-600 transition">
              Countdown
            </button>

            <button className="bg-red-500 px-6 py-2 rounded-md hover:bg-red-600 transition">
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}