import connectToDatabase from "@/lib/mongodb"
import { NewsItem } from "@/models"
import { 
  Newspaper, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye,
  Calendar,
  User,
  CheckCircle2,
  Clock
} from "lucide-react"
import Link from "next/link"
import StatusBadge from "@/components/admin/StatusBadge"
import DataTable from "@/components/admin/DataTable"
import { format } from "date-fns"
import NewsTable from "./NewsTable"

export const dynamic = "force-dynamic"

async function getNewsData() {
  try {
    await connectToDatabase();
    const newsRaw = await NewsItem.find({})
      .sort({ publishedAt: -1 })
      .populate("authorId")
      .lean();
    
    return newsRaw.map((n: any) => ({
      ...n,
      id: n._id.toString(),
      author: n.authorId
    }));
  } catch (error) {
    console.warn("News data fetch failed:", error)
    return []
  }
}

export default async function AdminNewsPage() {
  const news = await getNewsData()

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-5xl font-bebas tracking-wider text-gray-900 uppercase">News & Announcements</h1>
          <p className="text-gray-500 font-dm-sans">Publish news, press releases, and official updates.</p>
        </div>
        <Link 
          href="/admin/news/create"
          className="px-8 py-4 bg-[#E85D04] text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-[#C44D03] transition-all shadow-lg shadow-[#E85D04]/20"
        >
          <Plus size={20} />
          WRITE ARTICLE
        </Link>
      </div>

      {/* Table Section */}
      <div className="space-y-6">
        <NewsTable news={news} />
      </div>
    </div>
  )
}
