import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import EditTournamentForm from "./EditTournamentForm"

async function getTournament(id: string) {
  const tournament = await prisma.tournament.findUnique({
    where: { id }
  })
  return tournament
}

export default async function EditTournamentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const tournament = await getTournament(id)

  if (!tournament) notFound()

  return <EditTournamentForm tournament={tournament} />
}
