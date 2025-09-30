"use client"
import React from 'react'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
  } from "@/components/ui/collapsible"
import Link from 'next/link'
import { ChevronRight, Plus  } from 'lucide-react'

export default function CollapsibleLink({href, title, setShowSidebar}) {
  return (
        <Link className="flex items-center justify-between pr-3 pl-8
                        hover:bg-slate-900 transition-all 
                        duration-300 py-2.5 rounded-md" 
                        href={href} 
                        onClick={()=> setShowSidebar(false)}
        >
            <span className='text-sm'>{title}</span>
            <Plus className='w-3 h-3'/>
        </Link>
    );
}


