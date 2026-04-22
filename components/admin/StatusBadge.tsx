import { cn } from "@/lib/utils"

type StatusType = "tournament" | "payment" | "player" | "news"

interface StatusBadgeProps {
  status: string
  type: StatusType
  className?: string
}

export default function StatusBadge({ status, type, className }: StatusBadgeProps) {
  const getStyles = () => {
    const s = status.toUpperCase()
    
    if (type === "tournament") {
      switch (s) {
        case "OPEN": return "bg-green-100 text-green-700"
        case "DRAFT": return "bg-gray-100 text-gray-700"
        case "CLOSED": return "bg-yellow-100 text-yellow-700"
        case "ONGOING": return "bg-blue-100 text-blue-700"
        case "COMPLETED": return "bg-indigo-100 text-indigo-700"
        case "CANCELLED": return "bg-red-100 text-red-700"
        default: return "bg-gray-100 text-gray-700"
      }
    }

    if (type === "payment") {
      switch (s) {
        case "PAID": return "bg-green-100 text-green-700"
        case "PENDING": return "bg-yellow-100 text-yellow-700"
        case "FAILED": return "bg-red-100 text-red-700"
        default: return "bg-gray-100 text-gray-700"
      }
    }

    if (type === "player") {
      switch (s) {
        case "ACTIVE": return "bg-green-100 text-green-700"
        case "INACTIVE": return "bg-gray-100 text-gray-700"
        default: return "bg-gray-100 text-gray-700"
      }
    }

    if (type === "news") {
      switch (s) {
        case "PUBLISHED": return "bg-green-100 text-green-700"
        case "DRAFT": return "bg-gray-100 text-gray-700"
        default: return "bg-gray-100 text-gray-700"
      }
    }

    return "bg-gray-100 text-gray-700"
  }

  return (
    <span className={cn(
      "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest inline-flex items-center justify-center",
      getStyles(),
      className
    )}>
      {status.replace("_", " ")}
    </span>
  )
}
