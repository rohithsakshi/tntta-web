import React from 'react';
import connectToDatabase from '@/lib/mongodb';
import { MatchSlot, TableStatus, MatchStatus } from '@/models';
import AdminFixturesControl from '@/components/fixtures/AdminFixturesControl';

export const dynamic = "force-dynamic";

async function getAdminData(tournamentId: string) {
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
      .limit(20)
      .populate("player1Id")
      .populate("player2Id")
      .lean(),
    ]);

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
      tables: tablesWithMatches,
      upNext: upNextRaw.map((m: any) => ({ ...m, id: m._id.toString(), player1: m.player1Id, player2: m.player2Id })),
    };
  } catch (error) {
    console.error("Error fetching admin fixture data:", error);
    return { tables: [], upNext: [] };
  }
}

export default async function AdminFixturePage({ params }: { params: Promise<{ tournamentId: string }> }) {
  const { tournamentId } = await params;
  const data = await getAdminData(tournamentId);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-6">
      <AdminFixturesControl 
        tournamentId={tournamentId} 
        initialTables={data.tables} 
        initialUpNext={data.upNext} 
      />
    </div>
  );
}
