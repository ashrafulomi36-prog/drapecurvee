import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { product_name, size, quantity, colour, mobile, address } = body

    if (!product_name || !size || !quantity || !colour || !mobile || !address) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    // 1 ── Save to Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { data, error } = await supabase
      .from('orders')
      .insert([{ product_name, size, quantity, colour, mobile, address, status: 'pending' }])
      .select().single()

    if (error) return NextResponse.json({ error: 'Database error' }, { status: 500 })

    const orderId = data?.id ?? 'N/A'
    const msg =
      `NEW DRAPECURVE ORDER\n` +
      `Product : ${product_name}\n` +
      `Size    : ${size}  |  Qty: ${quantity}\n` +
      `Colour  : ${colour}\n` +
      `Mobile  : ${mobile}\n` +
      `Address : ${address}\n` +
      `Payment : Cash on Delivery\n` +
      `Order ID: ${orderId}`

    // 2a ── Telegram (recommended)
    if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
      await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: process.env.TELEGRAM_CHAT_ID, text: msg }),
      }).catch(() => {})
    }

    // 2b ── Resend email
    if (process.env.RESEND_API_KEY && process.env.NOTIFY_EMAIL) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'orders@drapecurve.com',
          to: process.env.NOTIFY_EMAIL,
          subject: `New Order — ${product_name} (${size})`,
          text: msg,
        }),
      }).catch(() => {})
    }

    // 2c ── WhatsApp Business Cloud API
    if (process.env.WA_TOKEN && process.env.WA_PHONE_ID && process.env.WA_RECIPIENT) {
      await fetch(`https://graph.facebook.com/v18.0/${process.env.WA_PHONE_ID}/messages`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${process.env.WA_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: process.env.WA_RECIPIENT,
          type: 'text',
          text: { body: msg },
        }),
      }).catch(() => {})
    }

    return NextResponse.json({ success: true, orderId }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
