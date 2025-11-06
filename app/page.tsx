'use client'
import { useAppKit } from '@reown/appkit/react'
import React from 'react'
import { useAccount, useSignTypedData } from 'wagmi'
import { preparePaymentHeader } from 'x402/client'
import { getNetworkId } from 'x402/shared'
import { PaymentPayload } from 'x402/types'
import { exact } from 'x402/schemes'

import fetcher from '@/configs/fetcher'

export default function HomePage() {
  const { open } = useAppKit()
  const { address, isConnected } = useAccount()
  const { isError, isSuccess, signTypedDataAsync } = useSignTypedData()

  const handleClick = async () => {
    try {
      console.log('start handleClick')
      const res = await fetcher({
        url: '/api/x402/demo-2',
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
      // const dataFake = {
      //   payment:
      //     'eyJ4NDAyVmVyc2lvbiI6MSwic2NoZW1lIjoiZXhhY3QiLCJuZXR3b3JrIjoiYmFzZSIsInBheWxvYWQiOnsic2lnbmF0dXJlIjoiMHhiNDlmMWRkNTFiZWVjYTVhZmZhMTVkMWQ3NTZlM2NmNjU2OWJjMzEwMTA0NThhZmM4YmY4NGRmMWRmYmRmMTcxNGJmZTgzZDg5NGVlMGFkYjU0MzI4N2FiMzc2MjExZGE5YWEyZGIyNWIwMjM2NDQwNjM3OGNlNzM4MjZmYWY4MTFjIiwiYXV0aG9yaXphdGlvbiI6eyJmcm9tIjoiMHg5ZjI3NmFmNzlCMkI1REUyOTQ2QTg4QjBGZTI3MTczMThGOTI0ZDdjIiwidG8iOiIweDlmMjc2YWY3OWIyYjVkZTI5NDZhODhiMGZlMjcxNzMxOGY5MjRkN2MiLCJ2YWx1ZSI6IjEwMDAwIiwidmFsaWRBZnRlciI6IjE3NjIzOTg3MDUiLCJ2YWxpZEJlZm9yZSI6IjE3NjI0NTkzMDUiLCJub25jZSI6IjB4NjVkZDQ2OTgxNjcxM2Q3ZGFiYzUzMTMwOGFkYWRhZTg4MTMzZDk2NDk0YjRhNWVlMTRjODVlNGU0NjRiMTNhYiJ9fX0=',
      // }
      const payment: string = exact.evm.encodePayment(paymentPayload)

      console.log({ payment: payment })

      const res2 = await fetcher({
        url: '/api/x402/demo-2',
        method: 'POST',
        headers: {
          'X-PAYMENT': payment,
        },
      })

      console.log({ res2 })

      // // await setCookie('payment-session', payment)
      // // const payment =
      // //   'eyJ4NDAyVmVyc2lvbiI6MSwic2NoZW1lIjoiZXhhY3QiLCJuZXR3b3JrIjoiYmFzZSIsInBheWxvYWQiOnsic2lnbmF0dXJlIjoiMHg1NTU3MzBlNDY4MWI2YjMwZTAwZjNiN2ViMDhkZDM5MWMxNGYzY2JkOTQwMTc3M2ZiN2M3ODgwNzYzMDRiMjE1NWZjM2U4YjE4MDY4MGM2YWFjOGNmYTY2MzcwOGM5YzM2NTI2ZmYwYzZjMTRlNjQ1Nzk0ODFjNTk3NTZlNGMwYTFiIiwiYXV0aG9yaXphdGlvbiI6eyJmcm9tIjoiMHg5ZjI3NmFmNzlCMkI1REUyOTQ2QTg4QjBGZTI3MTczMThGOTI0ZDdjIiwidG8iOiIweDlmMjc2YWY3OUIyQjVERTI5NDZBODhCMEZlMjcxNzMxOEY5MjRkN2MiLCJ2YWx1ZSI6IjEwMCIsInZhbGlkQWZ0ZXIiOiIxNzYyMzMxMDI1IiwidmFsaWRCZWZvcmUiOiIxNzYyMzkxNjI1Iiwibm9uY2UiOiIweGU1MjUwOGY4NmIyODM2MjliNDY5NWY0OGQ0MTFmODU5OGE4NjJiYWVlMThjM2Q5ZjU1Y2QwZTUyMmIwNmUwMjYifX19'

      // console.log({ payment })

      // const paymentDecode = exact.evm.decodePayment(payment)
      // const verifyPaymentWithPayment = verifyPayment.bind(null, payment)
      // const result = await verifyPaymentWithPayment()

      // console.log({ result })

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
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-4xl mx-auto px-4 py-16'>
        {/* Hero Section */}
        <div className='text-center mb-16'>
          <h1 className='text-5xl font-bold text-gray-900 mb-6'>
            Welcome to <span className='text-blue-600'>X402</span>
          </h1>
          <p className='text-xl text-gray-600 mb-8 max-w-2xl mx-auto'>
            Experience the future of micropayments with our decentralized protocol. Pay for content and services using cryptocurrency with minimal
            fees.
          </p>

          <div className='flex justify-center items-center space-x-4'>
            {!isConnected ? (
              <button
                className='bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-colors duration-200 shadow-lg'
                onClick={() => open()}
              >
                Connect Wallet to Get Started
              </button>
            ) : (
              <div className='flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4'>
                <div className='bg-white border border-gray-200 rounded-xl px-6 py-3 shadow-sm'>
                  <div className='flex items-center space-x-3'>
                    <div className='w-3 h-3 bg-green-500 rounded-full' />
                    <span className='font-mono text-gray-700'>{address}</span>
                  </div>
                </div>
                <button
                  className='bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-medium transition-colors duration-200 shadow-lg'
                  onClick={handleClick}
                >
                  Test Payment Flow
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-16'>
          <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-200'>
            <div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4'>
              <svg className='w-6 h-6 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                />
              </svg>
            </div>
            <h3 className='text-xl font-semibold text-gray-900 mb-2'>Secure Payments</h3>
            <p className='text-gray-600'>All payments are secured by blockchain technology and smart contracts.</p>
          </div>

          <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-200'>
            <div className='w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4'>
              <svg className='w-6 h-6 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path d='M13 10V3L4 14h7v7l9-11h-7z' strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} />
              </svg>
            </div>
            <h3 className='text-xl font-semibold text-gray-900 mb-2'>Lightning Fast</h3>
            <p className='text-gray-600'>Process micropayments instantly with minimal transaction fees.</p>
          </div>

          <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-200'>
            <div className='w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4'>
              <svg className='w-6 h-6 text-purple-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} />
              </svg>
            </div>
            <h3 className='text-xl font-semibold text-gray-900 mb-2'>Easy Integration</h3>
            <p className='text-gray-600'>Simple API integration for developers to accept micropayments.</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className='bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-8 text-center text-white'>
          <h2 className='text-3xl font-bold mb-4'>Ready to explore?</h2>
          <p className='text-blue-100 mb-6 text-lg'>Visit our demo dashboard to see X402 in action</p>
          <a
            className='inline-block bg-white text-blue-600 px-8 py-3 rounded-xl font-medium hover:bg-gray-100 transition-colors duration-200 shadow-lg'
            href='/demo'
          >
            View Dashboard Demo
          </a>
        </div>
      </div>
    </div>
  )
}
