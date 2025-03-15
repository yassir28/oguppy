 "use client"


import { Building2 } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

export default function HomeNavbar() {
    const pathname = usePathname();
    console.log(pathname);
    const navLinks =[
        {
            title:"Dashboard",
            href:"/side-bar/home/dashboard"
        }  ,      
        {
            title:"Gettig Started",
            href:"/side-bar/home/getting-started"
        }   ,     
        {
            title:"Recent Updates",
            href:"/side-bar/home/updates"
        },   
        {
            title:"Announcements",
            href:"/side-bar/home/announcements"
        }
    ];
  return (
    <div className='h-32 p-5 border-b border-slate-300'>
        <div className="flex space-x-3">
            {/*  here can an image be implemented as a background for the nav */}
            <div className="flex w-12 h-12 rounded-lg bg-white items-center justify-center">
                <Building2/>
            </div>
            <div className="flex flex-col">
                <p className='text-slate-700 font-semibold'> Hllo, JB dev</p>
                <span className='text-sm'> Garat</span>
            </div>
        </div>    
        <nav className='sticky mt-6 flex space-x-4'>
            {
                navLinks.map((item, i)=>{
                    return(
                        <Link 
                            key={i} 
                            href={item.href} 
                            className=  {`${pathname===item.href? " py-1 border-b-2 border-blue-600": "py-1"}`} >
                            {item.title}
                        </Link>
                    )
                })
            }
        </nav>
    </div>
  )
}
