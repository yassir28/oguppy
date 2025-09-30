import DataTable from '@/components/dashboard/DataTable'
import FixedHeader from '@/components/dashboard/FixedHeader'
import { getData } from '@/lib/getData'
import React from 'react'

export default async function Adjustments() {
  const addAdjustmentsData =  getData("adjustments/add")
  const transferAdjustmentsData =  getData("adjustments/transfer")

  const [addAdjustments, transferAdjustments] = await Promise.all([addAdjustmentsData, transferAdjustmentsData ])

  const addcolumns =["referenceNumber", "addStockQty"]
  const transfercolumns =["referenceNumber", "transferStockQty"]
  return (
    <div>
        {/**header */}
      <FixedHeader title="Adjustments" newLink="/side-bar/inventory/adjustments/new"/>


        
        {/**Table */}
        <div className="m-4 ">
            <h2 className='m-2 py-2'>Stock Increments Adjustments</h2>        
            <DataTable data ={addAdjustments} columns = {addcolumns}
                        resourceTitle="adjustments/add"/>
        </div>

        <div className="m-4 ">  
            <h2 className='m-2 py-2'>Stock Transfer Adjustments</h2>        
            <DataTable data ={transferAdjustments} columns = {transfercolumns}
                      resourceTitle="adjustments/transfer"  />
        </div>

    </div>
  )
}
