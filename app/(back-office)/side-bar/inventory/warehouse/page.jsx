import DataTable from '@/components/dashboard/DataTable'
import FixedHeader from '@/components/dashboard/FixedHeader'
import { getData } from '@/lib/getData'
import React from 'react'

export default async function Warehouses() {
  const warehouses = await getData("warehouse")
  const columns =["title", "location", "warehouseType"]
  return (
    <div>
        {/**header */}
      <FixedHeader title="Warehouse" newLink="/side-bar/inventory/warehouse/new"/>


        
        {/**Form */}
        <div className="m-4 ">        
            <DataTable data ={warehouses} columns = {columns}  resourceTitle="warehouse"/>
        </div>

    </div>
  )
}
