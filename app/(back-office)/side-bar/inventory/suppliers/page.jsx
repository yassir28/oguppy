
import DataTable from '@/components/dashboard/DataTable'
import FixedHeader from '@/components/dashboard/FixedHeader'
import { getData } from '@/lib/getData'
import React from 'react'

export default async function Brands() {
  const suppliers = await getData("suppliers")
  const columns =["title", "updatedAt"]
  console.log("error")
  return (
    <div>
        {/**header */}
      <FixedHeader title="Suppliers" newLink="/side-bar/inventory/suppliers/new"/>

        {/**Table */}
        <div className="m-4 p-8 ">        
            <DataTable data ={suppliers} 
            columns = {columns} 
            resourceTitle="suppliers" />
        </div>

    </div>
  )
}
