import React, { useState } from 'react'
type DropItemProps = {
  title: string
  desc: string
  method: 'GET' | 'POST'
  children?: React.ReactNode
}
function DropItem({ title, desc, method, children }: DropItemProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className='bg-white rounded-xl mb-6 shadow-sm border border-gray-200'>
      <div className='flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors' onClick={() => setOpen(!open)}>
        <div className='flex items-center space-x-4'>
          <div className='flex items-center space-x-2'>
            <span
              className={`bg-green-100 text-xs border border-green-700 font-medium px-2.5 py-1.5 rounded ${method === 'POST' ? 'text-green-800' : ' text-blue-800 '}`}
            >
              {method}
            </span>
            <span className='font-medium text-gray-900'>/{title}</span>
          </div>
          <span className='text-gray-500 text-sm'>{desc}</span>
        </div>

        <div className='flex items-center space-x-2'>
          {open && <span className='bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded'>Active</span>}
          <button className='text-gray-400 hover:text-gray-600'>
            <svg
              className={`w-5 h-5 transform transition-transform ${open ? 'rotate-180' : ''}`}
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path d='M19 9l-7 7-7-7' strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} />
            </svg>
          </button>
        </div>
      </div>
      {open && <div className='border-t border-gray-200 p-6'>{children}</div>}
    </div>
  )
}

export default DropItem
