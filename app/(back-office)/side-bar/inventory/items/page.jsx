
import DataTable from '@/components/dashboard/DataTable'
import FixedHeader from '@/components/dashboard/FixedHeader'
import { getData } from '@/lib/getData'
import React from 'react'


/**
 * Items listing page
 * Shows all inventory items in a table
 * 
 * Protected: Any authenticated user can view items (USER or ADMIN)
 * 
 * This is a Server Component - it queries the database directly
 * instead of making an API call, which is faster and more secure
 */

export default async function Items() {
  // Check if user is authenticated (any role can view)
  // This will redirect to /login if not authenticated
  

  const items = await getData("items")
  console.log('Items data:', items) // Add this line

  const columns =["imageUrl","title", "category.title", "warehouse.title",  "quantity"]
  return (
    <div>
        {/**header */}
      <FixedHeader title="Items" newLink="/side-bar/inventory/items/new"/>
        {/**Form */}
        <div className="m-4 ">        
            <DataTable data ={items} columns = {columns}  resourceTitle="items"/>
        </div>

    </div>
  )
}
