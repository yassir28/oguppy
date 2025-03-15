import { Bell, ChevronDown, History, LayoutGrid, Plus,  Settings,  Users } from 'lucide-react'
import React from 'react'
import SearchInput from './SearchInput'
import Image from 'next/image'

export default function Header() {
  return (
    <div className='bg-gray-100 h-12 flex items-center justify-between px-8 border-b border-slate-300 shadow'>
        <div className='flex gap-3'>
          {/* Recent activities*/}
          <button>
            <History className='w-6 h-6'/>
          </button>
          {/* Search*/}
          <SearchInput/>
        </div>

        <div className='flex items-center gap-3'>
          {/* Plus Icon*/}
          <div className='pr-2 border-r border-gray-300'>
            <button  className="p-1 rounded-lg bg-blue-600">
              <Plus className='text-slate-50 w-4 h-4'/>
            </button>
          </div>

          {/* users, notifis, settings*/}
          <div className='flex pr-2 border-r border-gray-300 space-x-2'>
          <button  className="p-1 rounded-lg hover:bg-slate-200">
              <Users className='text-slate-900 w-4 h-4'/>
            </button>
            <button  className="p-1 rounded-lg hover:bg-slate-200">
              <Bell className='text-slate-900 w-4 h-4'/>
            </button>
            <button  className="p-1 rounded-lg hover:bg-slate-200">
              <Settings className='text-slate-900 w-4 h-4'/>
            </button>
          </div>

          {/* 3rd section : Profile*/}
          <div className="flex gap-3">
            <button className='flex items-center'>
              <span>Garat</span>
              <ChevronDown className='w-3 h-3'/>
            </button>
            <button>
              <Image src= "/homer.jpg" alt= "user iamge" width={96} height={96} className='w-7 h-8 rounded-full border border-slate-900'/>
            </button>
            <button>
                <LayoutGrid className='w-6 h-6 text-slate-900'/>      
            </button>
          </div>
        </div>
    </div>
  )
}
