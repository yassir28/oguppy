"use client"

import React from 'react'
import { ChevronLeft, ShoppingCart, Home, BaggageClaim, ShoppingBag, ShoppingBasket, Cable, BarChart3, Files, X, SettingsIcon } from 'lucide-react'
import Link from 'next/link'
import SubscriptionCard from './SubscriptionCard'
import CollapsibleLink from './CollapsibleLink'
import SideDropDownLink from './SidebarDropdownLink'
import { useRole } from '@/lib/hooks/useRole'
import SideDropDown from './SideDropDown'

export default function Sidebar2({showSidebar, setShowSidebar}) {
    const { isAdmin, isUser } = useRole();
    console.log('Sidebar render - showSidebar:', showSidebar);

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

    const salesLinks = isAdmin ? adminSalesLinks : userSalesLinks;

    return (
        <div>


            <aside  
                id="sidebar-multi-level-sidebar" 
                className={`w-60 h-screen fixed top-0 left-0 z-50 bg-gray-50 dark:bg-gray-800 transition-transform duration-300
                    ${showSidebar ? 'translate-x-0' : '-translate-x-full '}`}
                aria-label="Sidebar"
            >

                {/* Top Part - Fixed header 
                lg:translate-x-0
                */}
                <div className="flex-shrink-0 flex justify-between border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                    <Link href="#" className="flex space-x-2 items-center py-3 px-2 w-full">
                        <ShoppingCart/>
                        <span className='text-xl font-semibold'>Inventory</span>
                    </Link>
                    <button 
                        className="py-3 px-4" 
                        onClick={() => setShowSidebar(false)}
                    >
                        <X className='h-6 w-6 text-black dark:text-white'/>
                    </button>
                </div>

                <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
                    {/* Navigation Links */}
                    <ul className="space-y-2 font-medium">
                        {/* Home - visible to all */}
                        <li>
                            <Link href="/side-bar/home/dashboard" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 42 42">
                                    <path d="M2.68 15.726c-.1.039-.16.09-.18.149l.18-.149zm-.18.149v20.627c0 2.509.49 2.998 3 2.998h7c2.51 0 3-.461 3-3v-8h9v8.031c0 2.51.51 2.979 3 2.969c.04.031 7 0 7 0c2.529 0 3-.526 3-2.997V16.495c0-.08-.09-.15-.27-.23L20 1.5L2.68 15.726l-.18.149z"/>
                                </svg>
                                <span className="ms-3">Home</span>
                            </Link>
                        </li>

                        {/* Inventory - visible to all */}
                        <SideDropDown title="Inventory" items={inventoryLinks} 
                        setShowSidebar={setShowSidebar} 
                        svgPath="m15.5 19.925l-4.25-4.25l1.4-1.4l2.85 2.85l5.65-5.65l1.4 1.4l-7.05 7.05ZM21 10h-2V5h-2v3H7V5H5v14h6v2H5q-.825 0-1.413-.588T3 19V5q0-.825.588-1.413T5 3h4.175q.275-.875 1.075-1.438T12 1q1 0 1.788.563T14.85 3H19q.825 0 1.413.588T21 5v5Zm-9-5q.425 0 .713-.288T13 4q0-.425-.288-.713T12 3q-.425 0-.713.288T11 4q0 .425.288.713T12 5Z" 
                        viewBox="0 0 24 24"/>

                        {/* Sales - different links based on role  */}
                        <SideDropDown title="Sales" items={salesLinks} 
                        setShowSidebar={setShowSidebar}
                        svgPath="M998 1023h-64q-14 0-25-9.5T895 991l-44-224H467l44 224q3 13-4.5 22.5T485 1023h-64q-13 0-24-9.5T383 991L193 32q-3-14 4.5-23T219 0h586q12 0 19 7.5t7 18.5q0 1 1 2.5t1 2.5l190 960q3 13-4.5 22.5T998 1023zM576 319q-49 0-88.5-18.5T448 255q0-26 25.5-45t70.5-19q48 0 60 4t36 28q4 5 9 14t10 13.5t13 4.5q14 0 24.5-9.5T704 223q-12-49-36.5-68.5T576 127q0-17-.5-25.5t-3.5-19t-10-15t-18-4.5t-18 5t-10 16t-3.5 19.5t-.5 23.5q-71 9-99.5 34.5T384 255t52.5 98T576 383q49 0 88.5 19t39.5 45t-25.5 45t-70.5 19q-48 0-60-4t-36-28q-4-4-9-13t-10-14t-13-5q-14 0-24.5 10t-7.5 22q12 50 36.5 69.5T576 575q0 18 .5 26t3.5 18.5t9.5 15t18 4.5t18.5-5t10-16t3.5-19t.5-24q71-8 99.5-33.5T768 447q0-67-52.5-97.5T576 319zM173 767l-44 224q-3 13-14 22.5t-25 9.5H26q-13 0-20.5-9.5T1 991l159-803l115 579H173zm500 64l-32 160q-3 13-14 22.5t-24 9.5h-28l-37-159l7-33h128z"
                        viewBox="0 0 1024 1023"
                        />

                        {/* Collections - different links based on role  */}
                        <SideDropDown title="Collections" items={salesLinks} 
                        setShowSidebar={setShowSidebar}
                        svgPath="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z"
                        viewBox="0 0 18 18"
                        />

                        {/* Purchases - ADMIN only */}
                        {isAdmin && (
                            <SideDropDown 
                            title="Purchases" 
                            items={inventoryLinks} 
                            setShowSidebar={setShowSidebar}
                            svgPath="m17.418 3.623-.018-.008a6.713 6.713 0 0 0-2.4-.569V2h1a1 1 0 1 0 0-2h-2a1 1 0 0 0-1 1v2H9.89A6.977 6.977 0 0 1 12 8v5h-2V8A5 5 0 1 0 0 8v6a1 1 0 0 0 1 1h8v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-4h6a1 1 0 0 0 1-1V8a5 5 0 0 0-2.582-4.377ZM6 12H4a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Z"
                            viewBox="0 0 20 20"
                            notificationSpan= ""
                            />
                        )}
                        

                        {/* Integrations - visible to all */}
                        <li>
                            <Link href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                    <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z"/>
                                </svg>
                                <span className="flex-1 ms-3 whitespace-nowrap">Integrations</span>
                            </Link>

                        </li>

                        {/* Reports - visible to all */}
                        <li>
                            <Link href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                                    <path d="M17 5.923A1 1 0 0 0 16 5h-3V4a4 4 0 1 0-8 0v1H2a1 1 0 0 0-1 .923L.086 17.846A2 2 0 0 0 2.08 20h13.84a2 2 0 0 0 1.994-2.153L17 5.923ZM7 9a1 1 0 0 1-2 0V7h2v2Zm0-5a2 2 0 1 1 4 0v1H7V4Zm6 5a1 1 0 1 1-2 0V7h2v2Z"/>
                                </svg>
                                <span className="flex-1 ms-3 whitespace-nowrap">Reports</span>
                            </Link>
                        </li>
                        {/* Settings - ADMIN only */}
                        {isAdmin && (
                            <li>
                                <a href="/side-bar/settings" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                    <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 42 42">
                                        <path d="M2.68 15.726c-.1.039-.16.09-.18.149l.18-.149zm-.18.149v20.627c0 2.509.49 2.998 3 2.998h7c2.51 0 3-.461 3-3v-8h9v8.031c0 2.51.51 2.979 3 2.969c.04.031 7 0 7 0c2.529 0 3-.526 3-2.997V16.495c0-.08-.09-.15-.27-.23L20 1.5L2.68 15.726l-.18.149z"/>
                                    </svg>
                                    <span className="flex-1 ms-3 whitespace-nowrap">Settings</span>
                                </a>
                            </li>
                        )}

                        {/* Documents - visible to all */}
                        <li>
                            <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">

                                <svg className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 21">
                                    <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z"/>
                                    <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z"/>
                                </svg>                                
                                <span className="flex-1 ms-3 whitespace-nowrap">Documents</span>
                            </a>
                        </li>                                                
                        <li>
                            <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 16">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"/>
                                </svg>
                                <span className="flex-1 ms-3 whitespace-nowrap">Sign In</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.96 2.96 0 0 0 .13 5H5Z"/>
                                    <path d="M6.737 11.061a2.961 2.961 0 0 1 .81-1.515l6.117-6.116A4.839 4.839 0 0 1 16 2.141V2a1.97 1.97 0 0 0-1.933-2H7v5a2 2 0 0 1-2 2H0v11a1.969 1.969 0 0 0 1.933 2h12.134A1.97 1.97 0 0 0 16 18v-3.093l-1.546 1.546c-.413.413-.94.695-1.513.81l-3.4.679a2.947 2.947 0 0 1-1.85-.227 2.96 2.96 0 0 1-1.635-3.257l.681-3.397Z"/>
                                    <path d="M8.961 16a.93.93 0 0 0 .189-.019l3.4-.679a.961.961 0 0 0 .49-.263l6.118-6.117a2.884 2.884 0 0 0-4.079-4.078l-6.117 6.117a.96.96 0 0 0-.263.491l-.679 3.4A.961.961 0 0 0 8.961 16Zm7.477-9.8a.958.958 0 0 1 .68-.281.961.961 0 0 1 .682 1.644l-.315.315-1.36-1.36.313-.318Zm-5.911 5.911 4.236-4.236 1.359 1.359-4.236 4.237-1.7.339.341-1.699Z"/>
                                </svg>
                                <span className="flex-1 ms-3 whitespace-nowrap">Sign Up</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </aside>
        </div>
    )
}