import prisma from "@/lib/prisma"
import { 
  Camera, 
  Upload, 
  Trash2, 
  Image as ImageIcon,
  Plus,
  Filter,
  Trophy
} from "lucide-react"
import Link from "next/link"
import StatsCard from "@/components/admin/StatsCard"

export const dynamic = "force-dynamic"

async function getGalleryData() {
  const images = await prisma.galleryImage.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      tournament: true,
      uploadedBy: true
    }
  })
  return images
}

export default async function AdminGalleryPage() {
  const images = await getGalleryData()

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-5xl font-bebas tracking-wider text-gray-900 uppercase">Gallery Management</h1>
          <p className="text-gray-500 font-dm-sans">Upload and organize tournament highlights.</p>
        </div>
        <button className="px-8 py-4 bg-[#E85D04] text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-[#C44D03] transition-all shadow-lg shadow-[#E85D04]/20">
          <Upload size={20} />
          UPLOAD PHOTOS
        </button>
      </div>

      {/* Grid of Images */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {images.map((img) => (
          <div key={img.id} className="bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm group hover:shadow-xl transition-all">
             <div className="aspect-square relative overflow-hidden">
                <img 
                  src={img.url} 
                  alt={img.caption || "Tournament Image"} 
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                   <button className="p-3 bg-white rounded-xl text-red-600 hover:bg-red-50 transition-all">
                      <Trash2 size={20} />
                   </button>
                </div>
             </div>
             <div className="p-6">
                <p className="text-sm font-bold text-gray-900 line-clamp-1">{img.caption || "Untitled Image"}</p>
                {img.tournament && (
                  <div className="flex items-center gap-2 mt-2 text-[#E85D04]">
                     <Trophy size={12} />
                     <span className="text-[10px] font-bold uppercase tracking-widest">{img.tournament.title}</span>
                  </div>
                )}
                <p className="text-[10px] text-gray-400 mt-3 font-medium italic">Uploaded {new Date(img.createdAt).toLocaleDateString()}</p>
             </div>
          </div>
        ))}
        {images.length === 0 && (
          <div className="col-span-full py-32 text-center bg-gray-50 rounded-[40px] border border-dashed border-gray-200">
             <ImageIcon className="mx-auto text-gray-200 mb-4" size={48} />
             <p className="text-gray-400 font-medium">No images found in the gallery.</p>
             <button className="mt-6 text-[#E85D04] font-bold text-sm hover:underline uppercase tracking-widest">Start Uploading</button>
          </div>
        )}
      </div>
    </div>
  )
}
