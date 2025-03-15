

import CreateItemForm from '@/components/dashboard/CreateItemForm'
import { getData } from '@/lib/getData'
import {  X } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default async function NewItem({}) {
  const categories = await  getData("categories")   ;
  const units = await  getData("units")  ;
  const brands = await  getData("brands")  ;
  const warehouses = await  getData("warehouse")  ;
 
  return (
    <div>
        {/**header */}
        <div className="flex items-center justify-between py-3 px-16 bg-white">
          <h2 className='text-xl font-semibold'> New Item</h2>
          <Link href="/side-bar/inventory/">
            <X/>
          </Link>
        </div>
        {/**Form */}  
        <CreateItemForm categories={categories} units={units} brands={brands} warehouses={warehouses}/>
        {/**buttons */}
    </div>
  )
}
