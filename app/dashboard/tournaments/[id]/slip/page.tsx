import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import SlipView from "./SlipView"

export const dynamic = "force-dynamic"

export default async function RegistrationSlipPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) redirect("/login")

  const { id } = await params

  const application = await prisma.tournamentApplication.findUnique({
    where: { id },
    include: {
      tournament: true,
      player: true
    }
  })

  if (!application || (application.playerId !== session.user.id && session.user.role !== "ADMIN")) {
    notFound()
  }

  // Convert application to a plain object to avoid serialization issues
  const plainApplication = JSON.parse(JSON.stringify(application))

  return <SlipView application={plainApplication} />
}
