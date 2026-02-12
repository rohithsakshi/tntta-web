import { Calendar, Trophy, BarChart3 } from "lucide-react";

export default function Features() {
  return (
    <section className="bg-white py-12 shadow-inner">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10 text-center">
        
        <div className="flex flex-col items-center">
          <div className="bg-blue-100 p-4 rounded-full">
            <Calendar className="text-blue-600 w-8 h-8" />
          </div>
          <h3 className="mt-4 font-semibold text-lg text-gray-800">
            Register for Events
          </h3>
          <p className="mt-2 text-gray-600 text-sm">
            Sign up for upcoming tournaments easily.
          </p>
        </div>

        <div className="flex flex-col items-center">
          <div className="bg-blue-100 p-4 rounded-full">
            <Trophy className="text-blue-600 w-8 h-8" />
          </div>
          <h3 className="mt-4 font-semibold text-lg text-gray-800">
            Track Live Scores
          </h3>
          <p className="mt-2 text-gray-600 text-sm">
            Follow matches in real-time.
          </p>
        </div>

        <div className="flex flex-col items-center">
          <div className="bg-blue-100 p-4 rounded-full">
            <BarChart3 className="text-blue-600 w-8 h-8" />
          </div>
          <h3 className="mt-4 font-semibold text-lg text-gray-800">
            Check Player Rankings
          </h3>
          <p className="mt-2 text-gray-600 text-sm">
            See where you stand!
          </p>
        </div>

      </div>
    </section>
  );
}