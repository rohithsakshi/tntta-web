import React from 'react';
import { MatchStatus } from '@prisma/client';
import prisma from '@/lib/prisma';
import AdminFixturesControl from '@/components/fixtures/AdminFixturesControl';

export const dynamic = "force-dynamic";

async function getAdminData(tournamentId: string) {
  if (!prisma) return { tables: [], upNext: [] };

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
      take: 20,
      include: {
        player1: true,
        player2: true,
      },
    }),
  ]);

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
    tables: tablesWithMatches,
    upNext,
  };
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
