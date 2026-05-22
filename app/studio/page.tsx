/**
 * Sanity Studio embedded in Next.js
 * Accessible at: /studio
 * Only Sanity-invited Gmail accounts can log in
 */
'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '@/sanity.config'

export default function StudioPage() {
  return <NextStudio config={config} />
}
