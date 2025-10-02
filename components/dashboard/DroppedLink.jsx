import { Plus } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function DroppedLink({href, title, setShowSidebar}) {
  return (
    <li>
        <Link href={href} 
            className="flex items-center justify-between w-full p-2 text-gray-900 transition duration-75 
                        rounded-lg pl-11 group hover:bg-gray-100 dark:text-white 
                        dark:hover:bg-gray-700"
            
        >
            <span className='text-sm'>{title}</span>
            <Plus className='w-3 h-3'/>
        </Link>
    </li>  
        
)
}
