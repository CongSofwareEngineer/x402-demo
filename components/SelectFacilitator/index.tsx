import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'

import { TYPE_FACILITATOR } from '@/constants/x402'
import { FacilitatorType } from '@/server/x402'
type SelectFacilitatorProps = {
  value: FacilitatorType
  onChange: (value: FacilitatorType) => void
}
function SelectFacilitator({ value, onChange }: SelectFacilitatorProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={dropdownRef} className='relative'>
      <div
        className='w-full border border-gray-300 rounded-md p-2 bg-white cursor-pointer flex items-center justify-between'
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <div className='flex items-center space-x-2'>
          <Image
            alt={TYPE_FACILITATOR[value as keyof typeof TYPE_FACILITATOR]?.icon}
            className='rounded-full'
            height={20}
            src={TYPE_FACILITATOR[value as keyof typeof TYPE_FACILITATOR]?.icon}
            width={20}
          />
          <span>{value.charAt(0).toUpperCase() + value.slice(1)}</span>
        </div>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path d='M19 9l-7 7-7-7' strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} />
        </svg>
      </div>

      {isDropdownOpen && (
        <div className='absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10'>
          {Object.entries(TYPE_FACILITATOR).map(([key, facilitatorConfig]) => (
            <div
              key={key}
              className='flex items-center space-x-2 p-2 hover:bg-gray-50 cursor-pointer'
              onClick={() => {
                onChange(key as 'daydreams' | 'base' | 'payAI')
                setIsDropdownOpen(false)
              }}
            >
              <Image alt={facilitatorConfig.icon} className='rounded-full' height={20} src={facilitatorConfig.icon} width={20} />
              <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SelectFacilitator
