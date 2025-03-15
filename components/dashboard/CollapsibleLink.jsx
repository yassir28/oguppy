"use client"
import React from 'react'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
  } from "@/components/ui/collapsible"
import Link from 'next/link'
import { ChevronRight, Plus  } from 'lucide-react'

export default function CollapsibleLink({title, items, icon}) {
  const Icon = icon
  return (
        <Collapsible>
            <CollapsibleTrigger className='flex justify-between items-center w-full '>
                <div className="flex items-center space-x-2 p-2">
                    <Icon className='w-4 h-4'/>
                    <span>{title}</span>
                </div>
                <ChevronRight className='w-4 h-4'/>
            </CollapsibleTrigger>

            <CollapsibleContent>
            </CollapsibleContent>
                {items.map((item,i)=> {
                    return(
                        <CollapsibleContent key={i} >
                            <Link className="flex items-center justify-between pr-3 pl-8 hover:bg-slate-900 transition-all duration-300 py-2.5 rounded-md" href={item.href} >
                                <span className='text-sm'>{item.title}</span>
                                <Plus className='w-3 h-3'/>
                            </Link>
                        </CollapsibleContent>
                    )
                })}
        </Collapsible>  

  )
}
