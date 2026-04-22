import type { Metadata } from "next"
import { Bebas_Neue, DM_Sans } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Providers } from "@/components/Providers"

const bebasNeue = Bebas_Neue({ 
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas"
})

const dmSans = DM_Sans({ 
  subsets: ["latin"],
  variable: "--font-dm-sans"
})

export const metadata: Metadata = {
  title: "TNTTA | Tamil Nadu Table Tennis Association",
  description: "The official platform for Tamil Nadu Table Tennis Association. Compete, Rank, Win.",
  icons: {
    icon: "/TNTTA_logo.png",
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${bebasNeue.variable} ${dmSans.variable} font-dm-sans bg-[#FAFAFA] text-[#0A0A0A] antialiased`}>
        <Providers>
          <Navbar />
          <main className="min-h-screen pt-[72px]">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}