import React from 'react'
import { getData } from '@/lib/getData';
import NewItem from '../../new/page';

export default async function Update({params}) {
      const { id } = await params; // ✅ Await params first, then destructure

    const data= await getData(`items/${id}`);
  return (
        <NewItem initialData={data} isUpdate={true}/>
  )
}
