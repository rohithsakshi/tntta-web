import { MatchStatus, EventType } from "@/models/enums";

export type Player = {
  id: string;
  firstName: string;
  lastName: string;
  district: string;
  rankingPoints: number;
  category: string;
};

export type MatchSlotInput = {
  matchNumber: number;
  tableNumber: number;
  scheduledStartTime: Date;
  scheduledEndTime: Date;
  round: string;
  category: string;
  eventType: EventType;
  player1Id: string | null;
  player2Id: string | null;
  status: MatchStatus;
};

export type BracketInput = {
  category: string;
  eventType: EventType;
  totalPlayers: number;
  totalRounds: number;
  bracketData: any;
};

export type GeneratedSchedule = {
  slots: MatchSlotInput[];
  brackets: BracketInput[];
  totalDuration: string;
  matchesCount: number;
  warnings: string[];
};

export function generateFixtures(input: {
  tournamentId: string;
  players: Player[];
  tables: number;
  slotDurationMinutes: number;
  startTime: Date;
  categories: string[];
  eventTypes: EventType[];
}): GeneratedSchedule {
  const { players, tables, slotDurationMinutes, startTime, categories, eventTypes } = input;
  const warnings: string[] = [];
  const slots: MatchSlotInput[] = [];
  const brackets: BracketInput[] = [];
  const allMatchesToSchedule: any[] = [];

  // Group players by category and handle each event type
  for (const cat of categories) {
    for (const et of eventTypes) {
      const relevantPlayers = players.filter(p => p.category === cat);
      if (relevantPlayers.length < 2) continue;

      relevantPlayers.sort((a, b) => b.rankingPoints - a.rankingPoints);

      // STEP 2: BUILD BRACKET
      const playerCount = relevantPlayers.length;
      const bracketSize = Math.pow(2, Math.ceil(Math.log2(playerCount)));
      const totalRounds = Math.log2(bracketSize);
      const byesCount = bracketSize - playerCount;

      if (byesCount > 0) {
        warnings.push(`${cat} ${et}: ${byesCount} bye(s) added`);
      }

      const bracketPositions: (Player | null)[] = new Array(bracketSize).fill(null);
      const seedPositions = getSeedPositions(bracketSize);
      for (let i = 0; i < playerCount; i++) {
        bracketPositions[seedPositions[i]] = relevantPlayers[i];
      }

      const roundsData = [];
      let currentRoundMatches = [];

      // First Round
      for (let i = 0; i < bracketSize; i += 2) {
        const p1 = bracketPositions[i];
        const p2 = bracketPositions[i + 1];
        const match = {
          player1Id: p1?.id || null,
          player2Id: p2?.id || null,
          status: (p1 === null || p2 === null) ? MatchStatus.BYE : MatchStatus.SCHEDULED,
          round: getRoundName(totalRounds, 1),
          category: cat,
          eventType: et,
          roundNumber: 1,
          position: i / 2
        };
        currentRoundMatches.push(match);
        if (match.status !== MatchStatus.BYE) {
          allMatchesToSchedule.push(match);
        }
      }
      roundsData.push({ round: 1, matches: currentRoundMatches });

      // Subsequent Rounds
      for (let r = 2; r <= totalRounds; r++) {
        const prevRound = roundsData[r - 2];
        const nextRoundMatches = [];
        for (let i = 0; i < prevRound.matches.length; i += 2) {
          const match = {
            player1Id: null,
            player2Id: null,
            status: MatchStatus.SCHEDULED,
            round: getRoundName(totalRounds, r),
            category: cat,
            eventType: et,
            roundNumber: r,
            position: i / 2
          };
          nextRoundMatches.push(match);
          allMatchesToSchedule.push(match);
        }
        roundsData.push({ round: r, matches: nextRoundMatches });
      }

      brackets.push({
        category: cat,
        eventType: et,
        totalPlayers: playerCount,
        totalRounds: totalRounds,
        bracketData: { rounds: roundsData },
      });
    }
  }

  // STEP 4: SCHEDULE ACROSS TABLES
  const tableAvailableTime = new Array(tables).fill(new Date(startTime));
  const bufferMs = 2 * 60 * 1000;
  const durationMs = slotDurationMinutes * 60 * 1000;

  // Interleave categories
  allMatchesToSchedule.sort((a, b) => a.category.localeCompare(b.category));

  let matchNum = 1;
  allMatchesToSchedule.forEach((match) => {
    // Team matches take 5 slots
    const isTeam = match.eventType === EventType.TEAM;
    const slotsNeeded = isTeam ? 5 : 1;
    
    let earliestTableIdx = 0;
    for (let i = 1; i < tables; i++) {
      if (tableAvailableTime[i] < tableAvailableTime[earliestTableIdx]) {
        earliestTableIdx = i;
      }
    }

    const scheduledStart = new Date(tableAvailableTime[earliestTableIdx]);
    
    for (let s = 0; s < slotsNeeded; s++) {
      const slotStart = new Date(scheduledStart.getTime() + s * (durationMs + bufferMs));
      const slotEnd = new Date(slotStart.getTime() + durationMs);

      slots.push({
        matchNumber: matchNum++,
        tableNumber: earliestTableIdx + 1,
        scheduledStartTime: slotStart,
        scheduledEndTime: slotEnd,
        round: isTeam ? `Match ${s + 1}` : match.round,
        category: match.category,
        eventType: match.eventType,
        player1Id: match.player1Id,
        player2Id: match.player2Id,
        status: match.status,
      });

      tableAvailableTime[earliestTableIdx] = new Date(slotEnd.getTime() + bufferMs);
    }
  });

  const lastEndTime = new Date(Math.max(...tableAvailableTime.map(t => t.getTime())));
  const diffMs = lastEndTime.getTime() - startTime.getTime();
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  return {
    slots,
    brackets,
    totalDuration: `~${diffHrs} hours ${diffMins} minutes`,
    matchesCount: slots.length,
    warnings,
  };
}

function getSeedPositions(size: number): number[] {
  const positions = [0];
  for (let step = 1; step < size; step <<= 1) {
    for (let i = 0; i < step; i++) {
      positions[i + step] = (step << 1) - 1 - positions[i];
    }
  }
  return positions;
}

function getRoundName(totalRounds: number, currentRound: number): string {
  const remaining = totalRounds - currentRound;
  if (remaining === 0) return "Final";
  if (remaining === 1) return "Semifinal";
  if (remaining === 2) return "Quarterfinal";
  return `Round of ${Math.pow(2, remaining + 1)}`;
}
