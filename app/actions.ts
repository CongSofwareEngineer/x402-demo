'use server'

import { cookies } from 'next/headers'
import { useFacilitator } from 'x402/verify'
import { PaymentRequirements } from 'x402/types'
import { exact } from 'x402/schemes'
import { parseUnits } from 'viem'
import { facilitator } from '@coinbase/x402'

import { COINBASE_CONFIG } from '@/configs/app'

export async function verifyPayment(payload: string) {
  // right now this needs to be defined in 2 places, we'll clean this up with a proper nextjs abstraction
  const paymentRequirements: PaymentRequirements = {
    scheme: 'exact',
    network: 'base',
    maxAmountRequired: parseUnits(COINBASE_CONFIG.PAY_AMOUNT, 6).toString(),
    resource: 'https://api.questflow.ai/x402/swarm/qrn:swarm:68fbfd8a16687e1a9672ea8d',
    description: 'Access to protected content',
    mimeType: 'text/html',
    payTo: COINBASE_CONFIG.PAY_TO,
    maxTimeoutSeconds: COINBASE_CONFIG.MAX_TIMEOUT,
    asset: COINBASE_CONFIG.PAY_ASSET,
    outputSchema: undefined,
    extra: {
      name: 'USDT Coin',
      version: '2',
    },
  }

  const { verify, settle, list, } = useFacilitator(facilitator); // eslint-disable-line

  try {
    const payment = exact.evm.decodePayment(payload)
    const listData = await list()

    listData?.items[0]

    console.log({ item: listData?.items[0], listData, urlServer: facilitator.url })

    const valid = await verify(payment, paymentRequirements)

    if (!valid.isValid) {
      throw new Error(valid.invalidReason)
    }

    const settleResponse = await settle(payment, paymentRequirements)

    console.log({ settleResponse })

    if (!settleResponse.success) {
      throw new Error(settleResponse.errorReason)
    }
  } catch (error) {
    console.error({ error })

    return `Error: ${error}`
  }

  const cookieStore = await cookies()

  // This should be a JWT signed by the server following best practices for a session token
  // See: https://nextjs.org/docs/app/guides/authentication#stateless-sessions
  cookieStore.set('payment-session', payload)
}
