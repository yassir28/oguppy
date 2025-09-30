import { HelpCircle, LayoutGrid, List, MoreHorizontal, Plus } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function FixedHeader({newLink, title}) {
  return (
    <div className='flex justify-between items-center bg-gray-200 py-5 px-4'>
        <button className='text-2xl'> {title}</button>
        <div className="flex gap-4">
          {/**New */}
          <Link href={newLink} className="p-1 rounded-sm bg-blue-600 flex items-center space-x-2 px-3 text-white
                  ">
              <Plus className='w-4 h-4'/>
              <span> New</span>
          </Link>
          {/**layout */}
          <div className="flex rounded-sm overflow-hidden">
            <button className=' border-r border-gray-400 bg-gray-400 p-2'>
                <List className='h-4 w-4'/>
            </button>
            <button className=' bg-gray-300 p-2'>
              <LayoutGrid className='h-4 w-4'/>
            </button>
          </div>
          {/**More */}
          <button className='bg-gray-300 p-2 rounded-sm'>
            <MoreHorizontal className='h-4 w-4'/>
          </button>
          {/**Help */}
          <button className='bg-orange-300 p-2 text-white rounded-sm'>
            <HelpCircle className='h-5 w-5'/>
          </button>
        </div>
    </div>
  )
}
