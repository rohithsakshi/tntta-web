import { z } from "zod"
import { Category, UserRole, Gender, TournamentStatus, PaymentStatus } from "@prisma/client"

export const playerRegistrationSchema = z.object({
  firstName: z.string().min(2, "First name is too short"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  contact: z.string().length(10, "Contact must be 10 digits"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  gender: z.nativeEnum(Gender),
  dob: z.string().transform((val) => new Date(val)),
  district: z.string().min(1, "District is required"),
  club: z.string().optional(),
  category: z.nativeEnum(Category),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

export const tournamentSchema = z.object({
  title: z.string().min(3),
  description: z.string(),
  location: z.string(),
  venue: z.string(),
  startDate: z.string().transform((val) => new Date(val)),
  endDate: z.string().transform((val) => new Date(val)),
  registrationOpens: z.string().transform((val) => new Date(val)),
  registrationDeadline: z.string().transform((val) => new Date(val)),
  entryFee: z.number().min(0),
  maxParticipants: z.number().optional().nullable(),
  categories: z.array(z.string()),
  status: z.nativeEnum(TournamentStatus),
  posterUrl: z.string().optional().nullable(),
})

export const tournamentApplicationSchema = z.object({
  tournamentId: z.string(),
  category: z.string(),
  amount: z.number(),
})

export const matchResultSchema = z.object({
  tournamentId: z.string(),
  player1Id: z.string(),
  player2Id: z.string(),
  score: z.string(),
  winnerId: z.string(),
  round: z.string(),
  category: z.string(),
})
