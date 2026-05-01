import React from 'react';
import { PrismaClient, MatchStatus } from '@prisma/client';
import AdminFixturesControl from '@/components/fixtures/AdminFixturesControl';

const prisma = new PrismaClient();

async function getAdminData(tournamentId: string) {
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
    tableStatuses.map(async (table) => {
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

export default async function AdminFixturePage({ params }: { params: { tournamentId: string } }) {
  const data = await getAdminData(params.tournamentId);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-6">
      <AdminFixturesControl 
        tournamentId={params.tournamentId} 
        initialTables={data.tables} 
        initialUpNext={data.upNext} 
      />
    </div>
  );
}

