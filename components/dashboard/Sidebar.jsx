"use client"

import { ChevronLeft, ShoppingCart, Home, BaggageClaim, ShoppingBag, ShoppingBasket, Cable, BarChart3, Files, X, SettingsIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import SubscriptionCard from './SubscriptionCard'
import CollapsibleLink from './CollapsibleLink'
import SideDropDownLink from './SidebarDropdownLink'
import { useRole } from '@/lib/hooks/useRole'

export default function Sidebar({showSidebar, setShowSidebar}) {

    const { isAdmin, isUser } = useRole();
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
    const adminSalesLinks =[
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
    const userSalesLinks =[
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
    
  
               
    ]

    // Choose which inventory links to show based on role
  const salesLinks = isAdmin ? adminSalesLinks : userSalesLinks;

  return (
    <div className={`${showSidebar? "w-60 h-screen bg-slate-800 text-slate-50 fixed top-0 left-0 lg:block z-50 flex flex-col":
         "w-60 h-screen bg-slate-800 text-slate-50 hidden fixed top-0 left-0 lg:block z-50 flex flex-col"}`}>

            {/* Top Part - Fixed header */}
            <div className="flex-shrink-0">
                {/* Logo */}
                <div className="flex justify-between">
                    <Link href="#" className="bg-slate-950 flex space-x-2 items-center py-3 px-2 w-full">
                        <ShoppingCart/>
                        <span className='text-xl font-semibold'>Inventory</span>
                    </Link>
                    <button className="bg-slate-950 py-3 px-4" onClick={()=> setShowSidebar(false)}>
                        <X className='h-6 w-6 text-white'/>
                    </button>
                </div>
            </div>

            {/* Scrollable content area */}
            <div className="flex-1 overflow-y-auto">
                {/* Navigation Links */}
                <nav className='flex flex-col gap-3 px-3 py-6'>
                    {/* Home - visible to all */}
                    <Link className='flex items-center space-x-2 bg-blue-600 text-slate-50 p-2 rounded-md'
                             href="/side-bar/home/dashboard">
                        <Home className='w-4 h-4'/>
                        <span>Home</span>
                    </Link>

                    {/* Inventory - visible to all */}
                    <SideDropDownLink title="Inventory" items={inventoryLinks} 
                    icon = {BaggageClaim} setShowSidebar={setShowSidebar}/>
                    
                    {/* Sales - different links based on role  */}
                    <SideDropDownLink title="Sales" items={salesLinks} icon = {ShoppingBag} setShowSidebar={setShowSidebar}/>

                  {/* Purchases - ADMIN only */}
                    {isAdmin && (
                        <SideDropDownLink 
                        title="Purchases" 
                        items={inventoryLinks} 
                        icon={ShoppingBasket}
                        setShowSidebar={setShowSidebar}
                        />
                    )}

                    {/* Integrations - visible to all */}
                    <Link className='flex items-center space-x-2 p-2' href="#">
                        <Cable className='w-4 h-4'/>
                        <span>Integrations</span>
                    </Link>

                    {/* Reports - visible to all */}
                    <Link className='flex items-center space-x-2 p-2' href="#">
                        <BarChart3 className='w-4 h-4'/>
                        <span>Reports</span>
                    </Link>

                    {/* Documents - visible to all */}
                    <Link className='flex items-center space-x-2 p-2' href="#">
                        <Files className='w-4 h-4'/>
                        <span>Documents</span>
                    </Link>

                    {/* Settings - ADMIN only */}
                    {isAdmin && (
                        <Link 
                        className='flex items-center space-x-2 p-2 bg-purple-600 text-white rounded-md mt-2' 
                        href="/side-bar/settings"
                        >
                        <SettingsIcon className='w-4 h-4'/>
                        <span>Settings</span>
                        </Link>
                    )}
                </nav>

                <SubscriptionCard/>
            </div>

            {/* Bottom Part - Fixed footer */}
            <div className="flex-shrink-0">
                <button className="bg-slate-950 flex space-x-2 items-center justify-center py-3 px-2 w-full">
                    <ChevronLeft/>
                </button>
            </div>

    </div>
  )
}