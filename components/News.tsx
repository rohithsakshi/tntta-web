import Image from "next/image"
import Link from "next/link"
import { Calendar, ArrowRight } from "lucide-react"
import { format } from "date-fns"
import prisma from "@/lib/prisma"

async function getLatestNews() {
  return await prisma.newsItem.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
    take: 2,
  })
}

export default async function News() {
  const news = await getLatestNews()

  return (
    <section className="py-24 bg-[#FAFAFA]">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bebas tracking-wider text-[#0A0A0A] mb-2 uppercase">Latest News</h2>
            <div className="w-16 sm:w-24 h-1.5 bg-[#0077B6]" />
          </div>
          <Link 
            href="/news" 
            className="flex items-center gap-2 text-[#0077B6] font-bold hover:gap-3 transition-all text-sm sm:text-base"
          >
            VIEW ALL UPDATES
            <ArrowRight size={20} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {news.map((item: any) => (
            <Link 
              key={item.id}
              href={`/news/${item.id}`}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row"
            >
              <div className="relative w-full sm:w-64 h-64 sm:h-auto overflow-hidden shrink-0">
                <Image 
                  src={item.imageUrl || [
                    "https://media.istockphoto.com/id/1425158165/photo/table-tennis-ping-pong-paddles-and-white-ball-on-blue-board.jpg?s=612x612&w=is&k=20&c=q7kPR8BzNCOngSWY5t-VHNYfTK3_iQq4klx22sNAvS8=",
                    "https://media.istockphoto.com/id/178826162/photo/service-on-table-tennis.jpg?s=612x612&w=is&k=20&c=wN1HhMjrniuoHWhYs2BAobaIGUN_N6qJPjhnq9td1Tc="
                  ][item.id.length % 2]} 
                  alt={item.title} 
                  fill 
                  className="object-cover group-hover:scale-110 transition-all duration-700 opacity-80 group-hover:opacity-100"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="p-8 flex flex-col">
                <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest mb-3">
                  <Calendar size={14} className="text-[#0077B6]" />
                  {format(new Date(item.publishedAt), "MMMM dd, yyyy")}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#0077B6] transition-colors leading-tight">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm mb-6 line-clamp-2">
                  {item.excerpt}
                </p>
                <div className="mt-auto flex items-center gap-2 text-[#0077B6] font-bold text-sm">
                  READ MORE <ArrowRight size={16} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}