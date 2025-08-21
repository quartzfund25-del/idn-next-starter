
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json().catch(()=>null) as any
  // For demo: just log to server; in production, forward to analytics or store
  console.log('[RUM]', body)
  return NextResponse.json({ ok: true })
}
