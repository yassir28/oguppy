"use client"

import { ChevronLeft, ShoppingCart, Home, BaggageClaim, ShoppingBag, ShoppingBasket, Cable, BarChart3, Files, X } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import SubscriptionCard from './SubscriptionCard'
import CollapsibleLink from './CollapsibleLink'
import SideDropDownLink from './SidebarDropdownLink'

export default function Sidebar({showSidebar, setShowSidebar}) {
    const inventoryLinks =[
        {
            title:"All",
            href:"/side-bar/inventory"
        },        
        {
            title:"Items",
            href:"/side-bar/inventory/items"
        },
        {
            title:"categories",
            href:"/side-bar/inventory/categories"
        },
        {
            title:"brands",
            href:"/side-bar/inventory/brands"
        },
        {
            title:"units",
            href:"/side-bar/inventory/units"
        },
        {
            title:"warehouse",
            href:"/side-bar/inventory/warehouse"
        },
                
        {
            title:"adjustments",
            href:"/side-bar/inventory/adjustments"
        },
        {
            title:"suppliers",
            href:"/side-bar/inventory/suppliers"
        }        
    ]
    const salesLinks =[
        {
            title:"Customers",
            href:"#"
        },
        {
            title:"Sales Orders",
            href:"#"
        },
        {
            title:"Packages",
            href:"#"
        },
        {
            title:"Shipments",
            href:"#"
        },
        {
            title:"Invoices",
            href:"#"
        },
        {
            title:"Sales Receipts",
            href:"#"
        },
        {
            title:"Payments Received",
            href:"#"
        },
        {
            title:"Sales Returns",
            href:"#"
        },
        {
            title:"Credit Notes",
            href:"#"
        },                
    ]
  return (
    <div className={`${showSidebar? "w-60 min-h-screen bg-slate-800 text-slate-50 fixed lg:block z-50 ":
         "w-60 min-h-screen bg-slate-800 text-slate-50 hidden fixed lg:block z-50 "}`}>

            {/* Top Part */}
                <div className="flex flex-col">
                    {/* Logo */}
                    <div className="flex justify-between">
                        <Link href="#" className="bg-slate-950 flex space-x-2 items-center py-3 px-2 w-full">
                            <ShoppingCart/>
                            <span className='text-xl font-semibold'>Inventory</span>
                        </Link>
                        <button className="bg-slate-950 y-3 px-4 " onClick={()=> setShowSidebar(false)}>
                            <X className='h-6 w-6 text-white'/>
                        </button>
                    </div>
                    {/* Links */}
                    <nav className='flex flex-col  gap-3 px-3 py-6'>
                        <Link className='flex items-center space-x-2 bg-blue-600 text-slate-50 p-2 rounded-md'
                                 href="/side-bar/home/dashboard">
                            <Home className='w-4 h-4'/>
                            <span>Home</span>
                        </Link>

                        <SideDropDownLink title="Inventory" items={inventoryLinks} 
                        icon = {BaggageClaim} setShowSidebar={setShowSidebar}/>

                        <SideDropDownLink title="Sales" items={salesLinks} icon = {ShoppingBag} />

                        <SideDropDownLink title="Purchases" items={inventoryLinks} icon = {ShoppingBasket} />


                        <Link className='flex items-center space-x-2 p-2' href="#">
                            <Cable className='w-4 h-4'/>
                            <span>Integrations</span>
                        </Link>

                        <Link className='flex items-center space-x-2 p-2' href="#">
                            <BarChart3 className='w-4 h-4'/>
                            <span>Reports</span>
                        </Link>

                        <Link className='flex items-center space-x-2 p-2' href="#">
                            <Files className='w-4 h-4'/>
                            <span>Documents</span>
                        </Link>

                    </nav>
                    <SubscriptionCard/>
                </div>

            {/* Bottom Part */}
            <div className="flex flex-col">
                <button className="bg-slate-950 flex space-x-2 items-center justify-center py-3 px-2">
                    <ChevronLeft/>
                </button>
            </div>
            {/* Subscription Card */}
            {/* Footer Icon */}

    </div>
  )
}
