import { tournaments } from "@/app/lib/tournaments";

async function getRegistrations() {
  const res = await fetch("http://localhost:3000/api/registrations", {
    cache: "no-store",
  });
  return res.json();
}

export default async function AdminPage() {
  const registrations = await getRegistrations();

  return (
    <div className="min-h-screen p-20">
      <h1 className="text-4xl font-bold mb-10">
        Admin Dashboard
      </h1>

      <table className="w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 border">Name</th>
            <th className="p-3 border">Tournament</th>
          </tr>
        </thead>
        <tbody>
          {registrations.map((r: any) => {
            const tournament = tournaments.find(
              (t) => t.id === r.tournamentId
            );

            return (
              <tr key={r.id}>
                <td className="p-3 border">{r.name}</td>
                <td className="p-3 border">
                  {tournament?.name || "Unknown"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}