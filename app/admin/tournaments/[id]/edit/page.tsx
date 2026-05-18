import connectToDatabase from "@/lib/mongodb"
import { Tournament } from "@/models"
import { notFound } from "next/navigation"
import EditTournamentForm from "./EditTournamentForm"

async function getTournament(id: string) {
  try {
    await connectToDatabase();
    const tournament = await Tournament.findById(id).lean();
    if (!tournament) return null;
    return { ...tournament, id: tournament._id.toString() };
  } catch (error) {
    console.error("Error fetching tournament for edit:", error);
    return null;
  }
}

export default async function EditTournamentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const tournament = await getTournament(id)

  if (!tournament) notFound()

  return <EditTournamentForm tournament={tournament} />
}
