"use client"

interface GoogleMapProps {
  location: string
  venue?: string
  className?: string
}

export default function GoogleMap({ location, venue, className = "h-full w-full" }: GoogleMapProps) {
  const query = venue ? `${venue}, ${location}, Tamil Nadu` : `${location}, Tamil Nadu`
  const encodedQuery = encodeURIComponent(query)
  
  // Using the Google Maps Embed API (Embed API is free and doesn't require a key for basic usage in some cases, 
  // but usually needs a key. We'll use the standard iframe embed URL which is most reliable)
  const embedUrl = `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY_HERE&q=${encodedQuery}`
  
  // Fallback to standard Google Maps Search URL if no key is provided
  const fallbackUrl = `https://maps.google.com/maps?q=${encodedQuery}&t=&z=13&ie=UTF8&iwloc=&output=embed`

  return (
    <div className={`${className} rounded-3xl overflow-hidden border border-gray-100 shadow-inner bg-gray-100`}>
      <iframe
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={fallbackUrl}
        title={`Map of ${query}`}
      />
    </div>
  )
}
