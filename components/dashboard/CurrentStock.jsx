import DataTable from '@/components/dashboard/DataTable'
import { getData } from '@/lib/getData'
import React from 'react'

export default async function CurrentStock({title, items}) {

  const columns =["imageUrl","title", "quantity"]
  return (
    <div className='bg-pink-50 p-8'>
        {/**header */}
        <h2 className='text-xl font-semibold '>
          {title}
        </h2>

        {/**Form */}
        <div className="my-4">        
            <DataTable data ={items} columns = {columns}  resourceTitle="items"/>
        </div>

    </div>
  )
}
