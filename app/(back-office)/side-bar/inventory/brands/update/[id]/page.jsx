import React from 'react'
import { getData } from '@/lib/getData';
import NewBrand from '../../new/page';

export default async function Update({params}) {
      const { id } = await params; // ✅ Await params first, then destructure

    const data= await getData(`brands/${id}`);
  return (
        <NewBrand initialData={data} isUpdate={true}/>
  )
}
