export default function RankingsPage() {
  const players = [
    { rank: 1, name: "Arjun Kumar", district: "Chennai", points: 1280 },
    { rank: 2, name: "Vignesh S", district: "Coimbatore", points: 1210 },
    { rank: 3, name: "Rahul P", district: "Madurai", points: 1160 },
    { rank: 4, name: "Karthik M", district: "Salem", points: 1100 },
    { rank: 5, name: "Pranav R", district: "Trichy", points: 1040 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 px-6 py-16">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-10 text-gray-800">
          Player Rankings
        </h1>

        <div className="space-y-4">
          {players.map((player) => (
            <div
              key={player.rank}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition p-6 flex justify-between items-center"
            >
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold">
                  {player.rank}
                </div>

                <div>
                  <h2 className="font-semibold text-lg text-gray-800">
                    {player.name}
                  </h2>
                  <p className="text-gray-500 text-sm">
                    {player.district}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-blue-600 font-bold text-lg">
                  {player.points}
                </p>
                <p className="text-sm text-gray-400">Points</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}