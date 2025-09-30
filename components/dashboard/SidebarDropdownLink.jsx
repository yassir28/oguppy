"use client"
import React from 'react'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
  } from "@/components/ui/collapsible"
import Link from 'next/link'
import { ChevronRight, Plus  } from 'lucide-react'
import CollapsibleLink from './CollapsibleLink'

export default function SideDropDownLink({title, items, icon, setShowSidebar}) {
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
                {items.map((item,i)=> {
                    return(
                        <CollapsibleLink setShowSidebar={setShowSidebar} key={i} href={item.href} title = {item.title}/>
                    )
                })}
            </CollapsibleContent>
        </Collapsible>  
  )
}
