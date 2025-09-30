import DataTable from '@/components/dashboard/DataTable'
import FixedHeader from '@/components/dashboard/FixedHeader'
import { getData } from '@/lib/getData'
import React from 'react'

export default async function Units() {
  const units = await getData("units")
  const columns =["title", "abbreviation"]
  return (
    <div>
        {/**header */}
      <FixedHeader title="Units" newLink="/side-bar/inventory/units/new"/>


        
        {/**Form */}
        <div className="m-4 ">        
            <DataTable data ={units} columns = {columns} resourceTitle="units" />
        </div>

    </div>
  )
}
