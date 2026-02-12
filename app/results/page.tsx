export default function ResultsPage() {
  const matches = [
    {
      tournament: "Tamil Nadu State TT Open",
      player1: "Arjun Kumar",
      player2: "Vignesh S",
      score: "11-8, 9-11, 11-6, 11-7",
      winner: "Arjun Kumar",
    },
    {
      tournament: "South Zone Championship",
      player1: "Rahul P",
      player2: "Karthik M",
      score: "11-9, 11-5, 8-11, 11-6",
      winner: "Rahul P",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 px-6 py-16">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-10 text-gray-800">
          Tournament Results
        </h1>

        <div className="space-y-8">
          {matches.map((match, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition p-8"
            >
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                {match.tournament}
              </h2>

              <div className="flex justify-between items-center mb-4">
                <div className="space-y-2">
                  <p
                    className={`font-semibold ${
                      match.winner === match.player1
                        ? "text-green-600"
                        : "text-gray-800"
                    }`}
                  >
                    {match.player1}
                  </p>
                  <p
                    className={`font-semibold ${
                      match.winner === match.player2
                        ? "text-green-600"
                        : "text-gray-800"
                    }`}
                  >
                    {match.player2}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold text-blue-600">
                    {match.score}
                  </p>
                  <p className="text-sm text-gray-400">
                    Final Score
                  </p>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm font-medium inline-block">
                Winner: {match.winner}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}