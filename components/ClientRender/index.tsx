'use client'
import React, { useLayoutEffect, useState } from 'react'

import Header from '../Header'

function ClientRender({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false)

  useLayoutEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <>
      {isClient && (
        <>
          <Header />
          <main>{children}</main>
        </>
      )}
    </>
  )
}

export default ClientRender
