export default function Sponsors() {
  const sponsors = [
    "/sponsor-razorpay.png",
    "/sponsor-butterfly.png",
    "/sponsor-jio.png",
    "/sponsor-stag.png",
  ];

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">

        <h2 className="text-xl font-semibold text-gray-800 mb-10">
          Sponsors
        </h2>

        <div className="relative w-full overflow-hidden">

          {/* Left Fade */}
          <div className="absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />

          {/* Right Fade */}
          <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          <div className="flex animate-scroll gap-20 items-center">
            {[...sponsors, ...sponsors].map((logo, index) => (
              <img
                key={index}
                src={logo}
                alt="Sponsor Logo"
className="h-16 object-contain opacity-100"              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}