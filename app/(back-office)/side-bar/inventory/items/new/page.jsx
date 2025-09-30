

import CreateItemForm from '@/components/dashboard/CreateItemForm'
import FormHeader from '@/components/dashboard/FormHeader'
import { getData } from '@/lib/getData'
import {  X } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default async function NewItem({initialData={}, isUpdate=false}) {

  // sequential fetching => they wait for another.
  // const categoriesData = await  getData("categories")   ;
  // const unitsData = await  getData("units")  ;
  // const brandsData = await  getData("brands")  ;
  // const warehousesData = await  getData("warehouse")  ;
 

// parallel fetching
  const categoriesData =   getData("categories")   ;
  const unitsData =   getData("units")  ;
  const brandsData =   getData("brands")  ;
  const warehousesData =   getData("warehouse")  ;
  const suppliersData =   getData("suppliers")  ;

  const [categories, units, brands, warehouses, suppliers] = await 
  Promise.all([categoriesData, unitsData, brandsData, warehousesData, suppliersData])     ;


  return (
    <div>
        {/**header */}
        <FormHeader title={isUpdate?"Update Item": "New Item"} 
                    href= "/side-bar/inventory/items"/>
        
        {/**Form */}  
        <CreateItemForm categories={categories} units={units} brands={brands} suppliers={suppliers} warehouses={warehouses} initialData={initialData} isUpdate={isUpdate} />
        {/**buttons */}
    </div>
  )
}
