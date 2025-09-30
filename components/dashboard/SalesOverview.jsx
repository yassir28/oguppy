import { Check, CheckCircle2 } from 'lucide-react'
import Link from 'next/link';
import React from 'react'
import SalesActivityCard from './SalesActivityCard';
import InventorySummary from './InventorySummary';
import { getData } from '@/lib/getData';

export default async function SalesOverview() {

    // parallel fetching
    const categoriesData = getData("categories");
    const warehousesData = getData("warehouse");
    const suppliersData = getData("suppliers");
    const itemsData = getData("items"); 

    const [categories, warehouses, suppliers, items] = await 
    Promise.all([categoriesData, warehousesData, suppliersData, itemsData]);


    // Ensure we have arrays
    const warehousesArray = Array.isArray(warehouses) ? warehouses : [];
    const categoriesArray = Array.isArray(categories) ? categories : [];
    const suppliersArray = Array.isArray(suppliers) ? suppliers : [];
    const itemsArray = Array.isArray(items) ? items : [];

    const inventorySummary = warehousesArray.map((item, i) => {
        return {
            title: item.title,
            number: item.stockQty
        }
    })

    const salesActivity = [
        {
            title: "Categories",
            number: categoriesArray.length,
            unit: "Qty",
            href: "/side-bar/inventory/categories",
            color: "text-blue-800"
        },
        {
            title: "Warehouses",
            number: warehousesArray.length,
            unit: "Pkgs",
            href: "/side-bar/inventory/warehouse",
            color: "text-red-600"
        },
        {
            title: "Suppliers",
            number: suppliersArray.length,
            unit: "Qty",
            href: "/side-bar/inventory/suppliers",
            color: "text-green-600"
        },
        {
            title: "Items",
            number: itemsArray.length,
            unit: "Pkgs",
            href: "/side-bar/inventory/items",
            color: "text-yellow-600"
        }
    ];

    return (
        <div className='bg-blue-50 border-b border-slate-300 grid grid-cols-12 gap-4'>
            {/* sales activity */}
            <div className="col-span-full lg:col-span-8 border-r border-slate-300 p-8 py-16 lg:py-8">
                <h2 className='mb-6 text-2xl'>Sales activity</h2>
                <div className="pr-8 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {/* Card */}
                    {
                        salesActivity.map((item, i) => {
                            return (
                                <SalesActivityCard item={item} key={i} />
                            );
                        })
                    }
                </div>
            </div>
            {/* Inventory summary*/}
            <div className="col-span-full lg:col-span-4 p-8">
                <h2 className='mb-6 text-2xl'>Inventory summary</h2>
                <div className="">
                    {
                        inventorySummary.map((item, i) => {
                            return (
                                <InventorySummary item={item} key={i} />
                            );
                        })
                    }
                </div>
            </div>
        </div>
    )
}