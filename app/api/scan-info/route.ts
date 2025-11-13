// export { POST } from 'x402-next'

import { NextRequest } from 'next/server'

import X402ScanService from '@/services/x402scan'

export async function GET(req: NextRequest) {
  try {
    const res = await X402ScanService.getInfo()

    return new Response(
      JSON.stringify({
        data: res,
      })
    )
  } catch (error) {
    console.error('Error in /api/x402/demo:', error)

    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 })
  }
}
