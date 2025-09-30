
import DataTable from '@/components/dashboard/DataTable'
import FixedHeader from '@/components/dashboard/FixedHeader'
import { getData } from '@/lib/getData'
import React from 'react'

export default async function Brands() {
  const brands = await getData("brands")
  const columns =["title", "updatedAt"]
  console.log("error")
  return (
    <div>
        {/**header */}
      <FixedHeader title="Brands" newLink="/side-bar/inventory/brands/new"/>

        {/**Table */}
        <div className="m-4 p-8 ">        
            <DataTable data ={brands} 
            columns = {columns} 
            resourceTitle="brands" />
        </div>

    </div>
  )
}
