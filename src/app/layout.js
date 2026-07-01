import './globals.css'

export const metadata = {
  title: "Bakersfield's Best Mobile Detailing",
  description: "Premium mobile auto detailing in Bakersfield, CA. We come to you — showroom results at your door.",
  keywords: "mobile detailing Bakersfield, car detailing Bakersfield CA, auto detailing near me",
  openGraph: {
    title: "Bakersfield's Best Mobile Detailing",
    description: "Showroom-quality results at your door. Bakersfield's #1 mobile detail crew.",
    url: "https://bakersfieldsbest.com",
    type: "website",
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
