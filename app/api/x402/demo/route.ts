// export { POST } from 'x402-next'

import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    let urlFinal = req.url
    const url = new URL(req.url)
    const addressuser = url.searchParams.get('address') || ''
    // const reqBody = await req.json()

    console.log({ url })

    return new Response(
      JSON.stringify({
        message: 'Demo endpoint response',
        address: addressuser,
        requestBody: {
          status: 'success',
        },
      })
    )
  } catch (error) {
    console.error('Error in /api/x402/demo:', error)

    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 })
  }
}
