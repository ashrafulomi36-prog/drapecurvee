import type { Metadata } from 'next'
import { Bebas_Neue, DM_Sans } from 'next/font/google'
import './globals.css'

const bebas = Bebas_Neue({ weight: '400', subsets: ['latin'], variable: '--font-display', display: 'swap' })
const dm = DM_Sans({ subsets: ['latin'], variable: '--font-body', display: 'swap' })

export const metadata: Metadata = {
  title: 'DrapeCurve — Drape Different.',
  description: 'Premium oversized drop shoulder streetwear. Limited drops. Bangladesh.',
  keywords: ['DrapeCurve', 'oversized tshirt', 'drop shoulder', 'streetwear', 'Bangladesh', 'acid wash'],
  openGraph: { title: 'DrapeCurve — Drape Different.', description: 'Premium oversized streetwear. Drop 01.', type: 'website' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bebas.variable} ${dm.variable}`}>
      <body className="bg-[#080808] text-white antialiased">{children}</body>
    </html>
  )
}
