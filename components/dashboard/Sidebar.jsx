"use client"

import { ChevronLeft, ShoppingCart, Home, BaggageClaim, ShoppingBag, ShoppingBasket, Cable, BarChart3, Files } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import SubscriptionCard from './SubscriptionCard'
import CollapsibleLink from './CollapsibleLink'

export default function Sidebar() {
    const inventoryLinks =[
        {
            title:"Items",
            href:"/side-bar/inventory"
        },
        {
            title:"categories",
            href:"/side-bar/inventory"
        },
        {
            title:"brands",
            href:"/side-bar/inventory"
        },
        {
            title:"units",
            href:"/side-bar/inventory"
        },
        {
            title:"warehouse",
            href:"/side-bar/inventory"
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
    <div 
        className="w-60 min-h-screen bg-slate-800 text-slate-50 fixed"> {/*flex flex-col justify-between"> */}
            {/* Top Part */}
                <div className="flex flex-col">
                    {/* Logo */}
                    <Link href="#" className="bg-slate-700 flex space-x-2 items-center py-4 px-2">
                         <ShoppingCart/>
                        <span className='text-x1 font-semibold'>Inventory</span>
                    </Link>
                    {/* Links */}
                    <nav className='flex flex-col  gap-3 px-3 py-6'>
                        <Link className='flex items-center space-x-2 bg-blue-600 text-slate-50 p-2 rounded-md' href="#">
                            <Home className='w-4 h-4'/>
                            <span>Home</span>
                        </Link>

                        <CollapsibleLink title="Inventory" items={inventoryLinks} icon = {BaggageClaim} />

                        <CollapsibleLink title="Sales" items={salesLinks} icon = {ShoppingBag} />

                        <CollapsibleLink title="Purchases" items={inventoryLinks} icon = {ShoppingBasket} />


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
