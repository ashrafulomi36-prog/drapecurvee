// IMPORTANT — After deploying to Vercel:
// Go to sanity.io → project h42zfh5a → API → CORS Origins
// Add: https://drapecurvee.vercel.app (with Allow credentials ticked)
// Add: http://localhost:3000 (with Allow credentials ticked)

import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'h42zfh5a',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})
