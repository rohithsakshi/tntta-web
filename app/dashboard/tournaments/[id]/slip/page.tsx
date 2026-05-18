import { auth } from "@/lib/auth"
import connectToDatabase from "@/lib/mongodb"
import { TournamentApplication } from "@/models"
import { notFound, redirect } from "next/navigation"
import SlipView from "./SlipView"

export const dynamic = "force-dynamic"

export default async function RegistrationSlipPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) redirect("/login")

  const { id } = await params

  await connectToDatabase();
  const applicationRaw = await TournamentApplication.findById(id)
    .populate("tournamentId")
    .populate("playerId")
    .lean();

  if (!applicationRaw || (applicationRaw.playerId?._id.toString() !== session.user.id && session.user.role !== "ADMIN")) {
    notFound()
  }

  // Normalize data for SlipView
  const application = {
    ...applicationRaw,
    id: applicationRaw._id.toString(),
    tournament: applicationRaw.tournamentId,
    player: applicationRaw.playerId
  };

  return <SlipView application={application} />
}
