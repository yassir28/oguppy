

import ProtectedRoute from '@/components/auth/ProtectedRoute'
import CreateItemForm from '@/components/dashboard/CreateItemForm'
import FormHeader from '@/components/dashboard/FormHeader'
import { requireAdminServer } from '@/lib/auth/serverPageProtection'
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

    // Check if user is ADMIN on the server
  // If not ADMIN, this will redirect to /unauthorized
  // If not logged in, this will redirect to /login
  await requireAdminServer();


// parallel fetching
  const categoriesData =   getData("categories")   ;
  const unitsData =   getData("units")  ;
  const brandsData =   getData("brands")  ;
  const warehousesData =   getData("warehouse")  ;
  const suppliersData =   getData("suppliers")  ;

  const [categories, units, brands, warehouses, suppliers] = await 
  Promise.all([categoriesData, unitsData, brandsData, warehousesData, suppliersData])     ;


  return (
    // Wrap the entire page content with ProtectedRoute, Only users with ADMIN role can see this page
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <div>
        {/* Header */}
        <FormHeader 
          title={isUpdate ? "Update Item" : "New Item"} 
          href="/side-bar/inventory/items"
        />
        
        {/* Form */}  
        <CreateItemForm 
          categories={categories} 
          units={units} 
          brands={brands} 
          suppliers={suppliers} 
          warehouses={warehouses} 
          initialData={initialData} 
          isUpdate={isUpdate} 
        />
      </div>
    </ProtectedRoute>
  )
}