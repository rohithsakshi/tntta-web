import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { 
  Tournament, 
  MatchSlot, 
  TournamentBracket, 
  TableStatus, 
  EventType, 
  TournamentStatus, 
  TableStatusEnum,
  TournamentApplication
} from "@/models";
import { generateFixtures } from "@/lib/fixtures/generator";
import { pusher } from "@/lib/pusher";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { tournamentId } = await req.json();

    if (!tournamentId) {
      return NextResponse.json({ error: "Tournament ID is required" }, { status: 400 });
    }

    // 1. Fetch tournament details
    const tournament = await Tournament.findById(tournamentId).lean();

    if (!tournament) {
      return NextResponse.json({ error: "Tournament not found" }, { status: 404 });
    }

    // 2. Fetch all PAID applications with players
    const applications = await TournamentApplication.find({ 
      tournamentId, 
      paymentStatus: "PAID" 
    }).populate("playerId").lean();

    const players = applications.map((app: any) => ({
      id: app.playerId._id.toString(),
      firstName: app.playerId.firstName,
      lastName: app.playerId.lastName,
      district: app.playerId.district,
      rankingPoints: app.playerId.rankingPoints,
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
        EventType.MENS_SINGLES, 
        EventType.WOMENS_SINGLES,
        EventType.MENS_DOUBLES,
        EventType.WOMENS_DOUBLES,
        EventType.MIXED_DOUBLES,
        EventType.TEAM
      ] as any,
    });

    // 4. Data Updates
    // Clear existing
    await MatchSlot.deleteMany({ tournamentId });
    // await TeamMatch.deleteMany({ tournamentId }); // Add if needed
    await TournamentBracket.deleteMany({ tournamentId });
    await TableStatus.deleteMany({ tournamentId });

    // Create MatchSlots
    await MatchSlot.insertMany(generated.slots.map(slot => ({
      ...slot,
      tournamentId,
    })));

    // Create Brackets
    await TournamentBracket.insertMany(generated.brackets.map(bracket => ({
      ...bracket,
      tournamentId,
    })));

    // Create Table Statuses
    await TableStatus.insertMany(Array.from({ length: 10 }, (_, i) => ({
      tournamentId,
      tableNumber: i + 1,
      status: TableStatusEnum.IDLE,
    })));

    // Update tournament status
    await Tournament.findByIdAndUpdate(tournamentId, { 
      status: TournamentStatus.ONGOING 
    });

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
