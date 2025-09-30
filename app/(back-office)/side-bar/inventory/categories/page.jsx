import DataTable from '@/components/dashboard/DataTable'
import FixedHeader from '@/components/dashboard/FixedHeader'
import { getData } from '@/lib/getData'
import React from 'react'

export default async function Categories() {
  const categories = await getData("categories")
  const columns =["title", "description"]
  return (
    <div>
        {/**header */}
      <FixedHeader title="Categories" newLink="/side-bar/inventory/categories/new"/>


        
        {/**Form */}
        <div className="m-4 ">        
            <DataTable data ={categories} columns = {columns}  resourceTitle="categories"/>
        </div>

    </div>
  )
}
