'use client'
import { useAppKit } from '@reown/appkit/react'
import React from 'react'
import { useAccount, useSignTypedData } from 'wagmi'
import { exact } from 'x402/schemes'
import { PaymentPayload } from 'x402/types'
import { preparePaymentHeader } from 'x402/client'
import { getNetworkId } from 'x402/shared'

import { verifyPayment } from './actions'

import fetcher from '@/configs/fetcher'
import { setCookie } from '@/Cookie'

export default function HomePage() {
  const { open } = useAppKit()
  const { address, isConnected } = useAccount()
  const { isError, isSuccess, signTypedDataAsync } = useSignTypedData()

  const handleClick = async () => {
    try {
      console.log('start handleClick')
      const res = await fetcher({
        url: '/api/x402/demo',
        method: 'POST',
        // headers: {
        //   'X-PAYMENT': payment,
        // },
      })

      console.log({ res })

      const paymentRequirements = res?.data?.accepts[0]

      const unSignedPaymentHeader = preparePaymentHeader(address!, 1, paymentRequirements)

      console.log({ unSignedPaymentHeader })
      const eip712Data = {
        types: {
          TransferWithAuthorization: [
            { name: 'from', type: 'address' },
            { name: 'to', type: 'address' },
            { name: 'value', type: 'uint256' },
            { name: 'validAfter', type: 'uint256' },
            { name: 'validBefore', type: 'uint256' },
            { name: 'nonce', type: 'bytes32' },
          ],
        },
        domain: {
          name: paymentRequirements.extra?.name,
          version: paymentRequirements.extra?.version,
          chainId: getNetworkId(paymentRequirements.network),
          verifyingContract: paymentRequirements.asset as `0x${string}`,
        },
        primaryType: 'TransferWithAuthorization' as const,
        message: unSignedPaymentHeader.payload.authorization,
      }

      console.log({ eip712Data })
      const signature = await signTypedDataAsync(eip712Data)

      console.log({ signature })

      const paymentPayload: PaymentPayload = {
        ...unSignedPaymentHeader,
        payload: {
          ...unSignedPaymentHeader.payload,
          signature,
        },
      }
      const payment: string = exact.evm.encodePayment(paymentPayload)

      await setCookie('payment-session', payment)
      // const payment =
      //   'eyJ4NDAyVmVyc2lvbiI6MSwic2NoZW1lIjoiZXhhY3QiLCJuZXR3b3JrIjoiYmFzZSIsInBheWxvYWQiOnsic2lnbmF0dXJlIjoiMHg1NTU3MzBlNDY4MWI2YjMwZTAwZjNiN2ViMDhkZDM5MWMxNGYzY2JkOTQwMTc3M2ZiN2M3ODgwNzYzMDRiMjE1NWZjM2U4YjE4MDY4MGM2YWFjOGNmYTY2MzcwOGM5YzM2NTI2ZmYwYzZjMTRlNjQ1Nzk0ODFjNTk3NTZlNGMwYTFiIiwiYXV0aG9yaXphdGlvbiI6eyJmcm9tIjoiMHg5ZjI3NmFmNzlCMkI1REUyOTQ2QTg4QjBGZTI3MTczMThGOTI0ZDdjIiwidG8iOiIweDlmMjc2YWY3OUIyQjVERTI5NDZBODhCMEZlMjcxNzMxOEY5MjRkN2MiLCJ2YWx1ZSI6IjEwMCIsInZhbGlkQWZ0ZXIiOiIxNzYyMzMxMDI1IiwidmFsaWRCZWZvcmUiOiIxNzYyMzkxNjI1Iiwibm9uY2UiOiIweGU1MjUwOGY4NmIyODM2MjliNDY5NWY0OGQ0MTFmODU5OGE4NjJiYWVlMThjM2Q5ZjU1Y2QwZTUyMmIwNmUwMjYifX19'

      console.log({ payment })

      const paymentDecode = exact.evm.decodePayment(payment)
      const verifyPaymentWithPayment = verifyPayment.bind(null, payment)
      const result = await verifyPaymentWithPayment()

      console.log({ result })

      // const res2 = await fetcher({
      //   // url: '/api/x402/verify?address=' + address,
      //   url: '/api/x402/demo',
      //   method: 'POST',
      //   headers: {
      //     'X-PAYMENT': payment,
      //     'X-Payment-Response': payment,
      //     Authorization: `Bearer ${payment}`,
      //   },
      //   body: payment,
      // })

      // console.log({ res2 })

      // console.log({ paymentDecode, unSignedPaymentHeader, signature, paymentPayload, payment })

      // let headers = { 'Content-Type': 'application/json' }

      // if (facilitator?.createAuthHeaders) {
      //   const authHeaders = await facilitator.createAuthHeaders()

      //   headers = { ...headers, ...authHeaders.settle }
      // }
      // const paymentRequirementsSettle: PaymentRequirements = {
      //   scheme: 'exact',
      //   network: 'base',
      //   maxAmountRequired: parseUnits(COINBASE_CONFIG.PAY_AMOUNT, 6).toString(),
      //   resource: 'https://example.com',
      //   description: 'Payment for a service',
      //   mimeType: 'text/html',
      //   payTo: COINBASE_CONFIG.PAY_TO,
      //   maxTimeoutSeconds: COINBASE_CONFIG.MAX_TIMEOUT,
      //   asset: COINBASE_CONFIG.PAY_ASSET,
      //   outputSchema: undefined,
      //   extra: {
      //     name: 'USDT Coin',
      //     version: '2',
      //   },
      // }

      // const res2 = await fetcher({
      //   url: facilitator.url + '/settle',
      //   method: 'POST',
      //   headers,
      //   body: {
      //     x402Version: paymentDecode.x402Version,
      //     paymentPayload: toJsonSafe(paymentDecode),
      //     paymentRequirements: toJsonSafe(paymentRequirementsSettle),
      //   },
      // })

      // console.log({ res2 })
    } catch (error) {
      console.log('Error during payment process:', error)
    }
  }

  return (
    <div>
      {!isConnected ? (
        <button className='cursor-pointer bg-gray-700 px-5 py-2 rounded-[8px]' onClick={() => open()}>
          Login
        </button>
      ) : (
        <button className='cursor-pointer bg-gray-700 px-5 py-2 rounded-[8px]' onClick={handleClick}>
          {address}
        </button>
      )}
    </div>
  )
}
