export default function Results() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-10 text-gray-800">
          Latest Results
        </h2>

        <div className="space-y-6">
          
          {/* Final Match */}
          <div className="bg-gray-100 rounded-xl p-6 shadow flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Final Match</p>
              <div className="flex items-center gap-4 mt-2">
                <span className="font-semibold text-gray-800">
                  R. Kumar
                </span>

                <span className="bg-blue-700 text-white px-4 py-2 rounded-lg font-bold">
                  3 - 1
                </span>

                <span className="font-semibold text-gray-800">
                  S. Mehta
                </span>
              </div>
            </div>

            <p className="text-sm text-gray-500">
              (11-6, 9-11, 11-7, 11-6)
            </p>
          </div>

          {/* Semi Final */}
          <div className="bg-gray-100 rounded-xl p-6 shadow flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Semi-Final</p>
              <div className="flex items-center gap-4 mt-2">
                <span className="font-semibold text-gray-800">
                  A. Singh
                </span>

                <span className="bg-blue-700 text-white px-4 py-2 rounded-lg font-bold">
                  3 - 2
                </span>

                <span className="font-semibold text-gray-800">
                  V. Patel
                </span>
              </div>
            </div>

            <p className="text-sm text-gray-500">
              (11-6, 7-11, 12-10, 8-11, 11-9)
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}