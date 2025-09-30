
import DataTable from '@/components/dashboard/DataTable'
import FixedHeader from '@/components/dashboard/FixedHeader'
import { getData } from '@/lib/getData'
import React from 'react'

export default async function Items() {
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
