import React from 'react';
import connectToDatabase from '@/lib/mongodb';
import { MatchSlot, TableStatus, MatchStatus } from '@/models';
import LiveFixturesBoard from '@/components/fixtures/LiveFixturesBoard';

export const dynamic = "force-dynamic";

async function getFixtures(tournamentId: string) {
  try {
    await connectToDatabase();

    const [tableStatusesRaw, upNextRaw] = await Promise.all([
      TableStatus.find({ tournamentId })
        .sort({ tableNumber: 1 })
        .lean(),
      MatchSlot.find({
        tournamentId,
        status: MatchStatus.SCHEDULED,
      })
      .sort({ scheduledStartTime: 1 })
      .limit(10)
      .populate("player1Id")
      .populate("player2Id")
      .lean(),
    ]);

    // Fetch current match details for each table
    const tablesWithMatches = await Promise.all(
      tableStatusesRaw.map(async (table: any) => {
        let currentMatch = null;
        if (table.currentMatchId) {
          currentMatch = await MatchSlot.findById(table.currentMatchId)
            .populate("player1Id")
            .populate("player2Id")
            .lean();
        }
        return {
          ...table,
          id: table._id.toString(),
          currentMatch: currentMatch ? { ...currentMatch, id: currentMatch._id.toString(), player1: currentMatch.player1Id, player2: currentMatch.player2Id } : null,
        };
      })
    );

    return {
      playingNow: tablesWithMatches,
      upNext: upNextRaw.map((m: any) => ({ ...m, id: m._id.toString(), player1: m.player1Id, player2: m.player2Id })),
    };
  } catch (error) {
    console.error("Error fetching fixtures:", error);
    return { playingNow: [], upNext: [] };
  }
}

export default async function PublicFixturesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const fixtures = await getFixtures(id);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-6xl font-['Bebas_Neue'] text-[#E85D04]">⚡ PLAYING NOW</h1>
            <p className="text-gray-400">Live Tournament Board — Nehru Stadium, Coimbatore</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-['Bebas_Neue']">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
            <p className="text-xs text-[#2D6A4F] uppercase tracking-widest font-bold">● Live Sync Active</p>
          </div>
        </header>

        <LiveFixturesBoard 
          tournamentId={id} 
          initialTables={fixtures.playingNow} 
          initialUpNext={fixtures.upNext} 
        />
      </div>
    </div>
  );
}
