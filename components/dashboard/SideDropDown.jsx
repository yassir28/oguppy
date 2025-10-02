"use client"
import React from 'react'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
  } from "@/components/ui/collapsible"
import DroppedLink from './DroppedLink'

export default function SideDropDown({title, items, svgPath, viewBox, setShowSidebar}) {
  return (
    <li>
        <Collapsible>
            <CollapsibleTrigger className="flex items-center w-full p-2 text-base 
                                            text-gray-900 transition duration-75 rounded-lg 
                                            group hover:bg-gray-100 dark:text-white 
                                            dark:hover:bg-gray-700" >
                <svg    className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 
                                group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" 
                        aria-hidden="true" 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="currentColor" 
                        viewBox={viewBox}>
                    <path d={svgPath}/>
                </svg>
                <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">{title}</span>
                {/** use this in case wanted to implmement notifications
                <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">3</span>
                 */}
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                </svg>
            </CollapsibleTrigger>
            <CollapsibleContent>
                <ul id="dropdown-example" className=" py-2 space-y-2">
                    {items.map((item,i)=> {
                        return(
                            <DroppedLink setShowSidebar={setShowSidebar} key={i} href={item.href} title = {item.title}/>
                        )
                    })}
                </ul>
            </CollapsibleContent>
        </Collapsible>  

    </li>
  )
}
