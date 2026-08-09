import './globals.css'

export const metadata = {
  metadataBase: new URL('https://bakersfieldsbestmobiledetailing.com'),
  title: "Ceramic Coating & Mobile Detailing Bakersfield CA | Bakersfield's Best Mobile Detailing",
  description: "Bakersfield's #1 mobile car detailing — specializing in ceramic coatings, liquid PPF, and wipe-on window tint, with NanoPro's next-gen protection film coming soon. We come to you! Full details from $80. Serving all of Bakersfield, Oildale & Rosedale. Book online or call (661) 932-0000.",
  keywords: "mobile detailing Bakersfield, car detailing Bakersfield CA, mobile car wash Bakersfield, ceramic coating Bakersfield, ceramic coating specialist Bakersfield, liquid PPF Bakersfield, paint protection film Bakersfield, window tint Bakersfield, auto detailing near me, paint correction Bakersfield, mobile detailer 661",
  openGraph: {
    title: "Bakersfield's Best Mobile Detailing — Ceramic Coating Specialists",
    description: "Showroom-quality mobile detailing anywhere in Bakersfield. Ceramic coatings, liquid PPF, and wipe-on tint — with next-gen protection film coming soon. Book online 24/7.",
    url: "https://bakersfieldsbestmobiledetailing.com",
    siteName: "Bakersfield's Best Mobile Detailing",
    locale: "en_US",
    type: "website",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://bakersfieldsbestmobiledetailing.com" },
}

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "AutoDetailing",
  "name": "Bakersfield's Best Mobile Detailing",
  "image": "https://bakersfieldsbestmobiledetailing.com/gallery/01-raptor.jpg",
  "url": "https://bakersfieldsbestmobiledetailing.com",
  "telephone": "+16619320000",
  "priceRange": "$80-$1800",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Bakersfield",
    "addressRegion": "CA",
    "addressCountry": "US"
  },
  "geo": { "@type": "GeoCoordinates", "latitude": 35.3733, "longitude": -119.0187 },
  "areaServed": ["Bakersfield", "Oildale", "Rosedale", "Lamont", "Kern County"],
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
    "opens": "07:00",
    "closes": "18:00"
  },
  "makesOffer": [
    { "@type": "Offer", "name": "Express Detail", "price": "80", "priceCurrency": "USD" },
    { "@type": "Offer", "name": "Signature Detail", "price": "160", "priceCurrency": "USD" },
    { "@type": "Offer", "name": "Ceramic Coating", "price": "500", "priceCurrency": "USD" },
    { "@type": "Offer", "name": "Liquid PPF" },
    { "@type": "Offer", "name": "Wipe-On Window Tint" }
  ]
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
