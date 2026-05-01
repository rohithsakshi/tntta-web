import React from 'react';
import { PrismaClient } from '@prisma/client';
import BracketView from '@/components/fixtures/BracketView';

const prisma = new PrismaClient();

async function getBracketData(tournamentId: string, category?: string) {
  if (!process.env.DATABASE_URL) {
    console.warn('DATABASE_URL not set – skipping Prisma query for bracket data');
    return [];
  }
  const bracket = await prisma.tournamentBracket.findUnique({
    where: { tournamentId },
  });


  if (!bracket) return null;

  // bracketData is stored as JSON in the schema
  const data = bracket.bracketData as any;
  return data.rounds || [];
}

export const dynamic = "force-dynamic";

export default async function TournamentBracketPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ id: string }>,
  searchParams: Promise<{ category?: string }>
}) {
  const { id } = await params;
  const { category } = await searchParams;
  const rounds = await getBracketData(id, category);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 flex justify-between items-center">
          <div>
            <h1 className="text-6xl font-['Bebas_Neue'] text-[#E85D04]">TOURNAMENT BRACKET</h1>
            <p className="text-gray-400">Category: {category || 'All Categories'}</p>
          </div>
        </header>

        <div className="bg-[#111] border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
           <BracketView rounds={rounds} />
        </div>
      </div>
    </div>
  );
}

