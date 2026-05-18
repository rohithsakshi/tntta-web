import connectToDatabase from "@/lib/mongodb";
import { MatchSlot, MatchStatus } from "@/models";
import { pusher } from "@/lib/pusher";

export async function checkNoShows() {
  await connectToDatabase();
  const now = new Date();
  
  // Find matches that need no-show action
  const matches = await MatchSlot.find({
    status: MatchStatus.CALLING,
    noShowGraceUntil: { $lt: now },
    $or: [
      { player1Present: false },
      { player2Present: false }
    ]
  }).populate("player1Id").populate("player2Id");

  const results = { checked: matches.length, flagged: 0, autoWalkoversTriggered: 0 };

  for (const match of matches) {
    // Flag for admin
    await pusher.trigger(`tournament-${match.tournamentId}-admin`, "noshow.alert", {
      matchId: match.id,
      tableNumber: match.tableNumber,
      absentPlayer: !match.player1Present ? match.player1Id : match.player2Id,
      graceExpiredAt: match.noShowGraceUntil,
      autoWalkoverIn: "60s"
    });
    
    results.flagged++;
  }

  return results;
}
