"use client"

import { Printer, Download, Trophy, MapPin, Calendar, ShieldCheck as ShieldIcon, QrCode as QrIcon } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"

interface SlipViewProps {
  application: any
}

export default function SlipView({ application }: SlipViewProps) {
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8 no-print">
          <Link href="/dashboard/tournaments" className="text-gray-500 hover:text-gray-900 font-bold flex items-center gap-2">
             <Trophy size={20} /> Back to Dashboard
          </Link>
          <div className="flex gap-4">
            <button className="px-6 py-2 bg-white border border-gray-200 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-gray-50 transition-all shadow-sm">
              <Download size={18} /> DOWNLOAD PDF
            </button>
            <button 
              onClick={handlePrint}
              className="px-6 py-2 bg-gray-900 text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-black transition-all shadow-lg"
            >
              <Printer size={18} /> PRINT SLIP
            </button>
          </div>
        </div>

        {/* The Slip */}
        <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gray-100 relative">
          {/* Header */}
          <div className="bg-gray-900 p-10 text-white flex justify-between items-start">
            <div>
              <div className="w-16 h-16 bg-[#E85D04] rounded-2xl flex items-center justify-center mb-4 shadow-xl">
                <Trophy size={32} />
              </div>
              <h1 className="text-3xl font-bebas tracking-widest leading-none mb-2">TNTTA REGISTRATION SLIP</h1>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em]">Official Entry Confirmation</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-[#E85D04] uppercase tracking-widest mb-1">Application ID</p>
              <p className="text-2xl font-bebas">{application.appId}</p>
              <div className={`mt-4 px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest inline-block ${
                application.paymentStatus === "PAID" ? "bg-green-500/20 text-green-400" : "bg-orange-500/20 text-orange-400"
              }`}>
                {application.paymentStatus === "PAID" ? "PAYMENT SUCCESSFUL" : "PAYMENT PENDING"}
              </div>
            </div>
          </div>

          <div className="p-10 md:p-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Left Column: Tournament Details */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Event Details</h3>
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 leading-tight mb-2">{application.tournament.title}</h2>
                      <div className="flex items-center gap-2 text-[#E85D04] font-bold text-xs uppercase tracking-widest">
                         <span>{application.tournament.type?.replace("_", " ")}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-gray-600">
                      <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-[#E85D04]">
                        <Calendar size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</p>
                        <p className="font-bold text-gray-900">{format(new Date(application.tournament.startDate), "MMMM dd, yyyy")}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-gray-600">
                      <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-[#E85D04]">
                        <MapPin size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Venue</p>
                        <p className="font-bold text-gray-900">{application.tournament.venue}</p>
                        <p className="text-xs">{application.tournament.location}, TN</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Player Details */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Player Details</h3>
                  <div className="bg-gray-50 rounded-3xl p-6 space-y-6">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-full bg-white border border-gray-100 flex items-center justify-center font-bold text-[#E85D04] shadow-sm">
                         {application.player.firstName?.[0]}{application.player.lastName?.[0]}
                       </div>
                       <div>
                         <p className="font-bold text-gray-900 text-lg">{application.player.firstName} {application.player.lastName}</p>
                         <p className="text-[10px] font-bold text-[#E85D04] uppercase tracking-widest">{application.player.tnttaId || "NO ID"}</p>
                       </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Category</p>
                        <p className="font-bold text-gray-900">{application.category?.replace("_", " ")}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">District</p>
                        <p className="font-bold text-gray-900">{application.player.district}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-8">
                   <div className="flex justify-between items-center mb-2">
                     <span className="text-gray-500 font-medium">Registration Fee</span>
                     <span className="font-bold text-gray-900 font-bebas text-xl">₹{application.amount / 100}.00</span>
                   </div>
                   <div className="flex justify-between items-center mb-6">
                     <span className="text-gray-500 font-medium">Transaction Fee</span>
                     <span className="font-bold text-gray-900 font-bebas text-xl">₹0.00</span>
                   </div>
                   <div className="flex justify-between items-center pt-6 border-t-2 border-gray-900">
                     <span className="text-xl font-bebas text-gray-900">Total Paid</span>
                     <span className="text-3xl font-bebas text-[#E85D04]">₹{application.amount / 100}.00</span>
                   </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-20 pt-10 border-t border-dashed border-gray-200 flex flex-col md:flex-row justify-between items-center gap-8">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                    <ShieldIcon size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">Verified Registration</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Signed by TNTTA Secretary</p>
                  </div>
               </div>
               <div className="text-center md:text-right">
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-2">SCAN FOR AUTHENTICITY</p>
                 <div className="w-24 h-24 bg-gray-50 border border-gray-100 rounded-xl ml-auto flex items-center justify-center text-gray-200">
                    <QrIcon size={64} />
                 </div>
               </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Trophy size={200} />
          </div>
        </div>
        
        <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-12 mb-8">
           This is a computer generated slip and does not require a physical signature. 
           <br/>© 2025 TAMIL NADU TABLE TENNIS ASSOCIATION
        </p>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .bg-gray-100 { background: white !important; }
          .shadow-2xl { shadow: none !important; border: 1px solid #eee; }
        }
      `}} />
    </div>
  )
}
