import React from 'react';
import { MatchStatus } from '@prisma/client';
import prisma from '@/lib/prisma';
import LiveFixturesBoard from '@/components/fixtures/LiveFixturesBoard';

export const dynamic = "force-dynamic";

async function getFixtures(tournamentId: string) {
  if (!prisma) return { playingNow: [], upNext: [] };

  const [tableStatuses, upNext] = await Promise.all([
    prisma.tableStatus.findMany({
      where: { tournamentId },
      orderBy: { tableNumber: 'asc' },
    }),
    prisma.matchSlot.findMany({
      where: {
        tournamentId,
        status: MatchStatus.SCHEDULED,
      },
      orderBy: { scheduledStartTime: 'asc' },
      take: 10,
      include: {
        player1: true,
        player2: true,
      },
    }),
  ]);

  // Fetch current match details for each table
  const tablesWithMatches = await Promise.all(
    tableStatuses.map(async (table: any) => {
      let currentMatch = null;
      if (table.currentMatchId) {
        currentMatch = await prisma.matchSlot.findUnique({
          where: { id: table.currentMatchId },
          include: {
            player1: true,
            player2: true,
          },
        });
      }
      return {
        ...table,
        currentMatch,
      };
    })
  );

  return {
    playingNow: tablesWithMatches,
    upNext,
  };
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
