import React from 'react'

export default function InventorySummary({item}) {
  return (
    <div className="mb-4  shadow rounded-lg border border-slate-200 hover:border-blue-400 bg-white px-4 py-2
        cursor-pointer flex items-center gap-3 justify-between transition-all duration-300">
        <h2 className='uppercase text-slate-500 text-sm'>{item.title}</h2>
        <h4 className='font-semibold text-2xl'>{item.number}</h4>
    </div>
  )
}
