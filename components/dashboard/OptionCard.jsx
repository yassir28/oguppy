"use client"

import Link from 'next/link';
import React from 'react'

export default function OptionCard({optionData}) {
    const {title, description, link, linkTitle, enabled, icon:Icon} = optionData;
  return (
        <div className="shadow-md bg-white flex flex-col items-center justify-center gap-4 p-6 rounded-ms">
            <h2 className='text-xl fontbold'> {title}</h2>
            <div className="">
            <Icon strokeWidth=".5px" className='w-36 h-36'/>
            </div>
            <p className="line-clamp-1">
                {description}
            </p>
            {enabled? (
                <Link href={link} 
                        className="py-2 rounded-sm bg-blue-600  
                                    items-center space-x-2 px-3 
                                    text-white inline-flex">
                        {linkTitle}
                </Link>
                ):(
                <button className="py-2 rounded-sm bg-blue-600 
                                    inline-flex items-center 
                                    space-x-2 px-3 text-white">
                        Enable
                </button>
                )
            }
        </div>
    )
}
