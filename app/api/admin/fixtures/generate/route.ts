import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { $Enums } from "@prisma/client";
import { generateFixtures } from "@/lib/fixtures/generator";
import { pusher } from "@/lib/pusher";

export async function POST(req: NextRequest) {
  try {
    const { tournamentId } = await req.json();

    if (!tournamentId) {
      return NextResponse.json({ error: "Tournament ID is required" }, { status: 400 });
    }

    // 1. Fetch tournament details
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
      include: {
        applications: {
          where: { paymentStatus: "PAID" },
          include: { player: true },
        },
      },
    });

    if (!tournament) {
      return NextResponse.json({ error: "Tournament not found" }, { status: 404 });
    }

    // 2. Fetch all PAID players
    const players = tournament.applications.map((app: any) => ({
      id: app.player.id,
      firstName: app.player.firstName,
      lastName: app.player.lastName,
      district: app.player.district,
      rankingPoints: app.player.rankingPoints,
      category: app.category,
    }));

    if (players.length < 2) {
      return NextResponse.json({ error: "Not enough players to generate fixtures" }, { status: 400 });
    }

    // 3. Call generator
    const generated = generateFixtures({
      tournamentId,
      players,
      tables: 10, // Nehru Stadium has 10 tables
      slotDurationMinutes: 10,
      startTime: tournament.startDate,
      categories: tournament.categories,
      eventTypes: [
        $Enums.EventType.MENS_SINGLES, 
        $Enums.EventType.WOMENS_SINGLES,
        $Enums.EventType.MENS_DOUBLES,
        $Enums.EventType.WOMENS_DOUBLES,
        $Enums.EventType.MIXED_DOUBLES,
        $Enums.EventType.TEAM
      ],
    });

    // 4. Prisma Transaction
    await prisma.$transaction([
      // Clear existing
      prisma.matchSlot.deleteMany({ where: { tournamentId } }),
      prisma.teamMatch.deleteMany({ where: { tournamentId } }),
      prisma.tournamentBracket.deleteMany({ where: { tournamentId } }),
      prisma.tableStatus.deleteMany({ where: { tournamentId } }),

      // Create MatchSlots
      prisma.matchSlot.createMany({
        data: generated.slots.map(slot => ({
          ...slot,
          tournamentId,
        })),
      }),

      // Create Brackets
      ...generated.brackets.map(bracket => 
        prisma.tournamentBracket.create({
          data: {
            ...bracket,
            tournamentId,
          }
        })
      ),

      // Create Table Statuses
      prisma.tableStatus.createMany({
        data: Array.from({ length: 10 }, (_, i) => ({
          tournamentId,
          tableNumber: i + 1,
          status: $Enums.TableStatusEnum.IDLE,
        })),
      }),

      // Update tournament status
      prisma.tournament.update({
        where: { id: tournamentId },
        data: { status: $Enums.TournamentStatus.ONGOING },
      }),
    ]);

    // 5. Trigger Pusher
    await pusher.trigger(`tournament-${tournamentId}-fixtures`, "fixtures.generated", {
      totalMatches: generated.matchesCount,
      estimatedDuration: generated.totalDuration,
    });

    return NextResponse.json({
      success: true,
      matchesGenerated: generated.matchesCount,
      estimatedDuration: generated.totalDuration,
      warnings: generated.warnings,
      firstRoundStartsAt: tournament.startDate,
    });

  } catch (error: any) {
    console.error("Fixture Generation Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
