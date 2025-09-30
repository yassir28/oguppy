import React from 'react'
import { getData } from '@/lib/getData';
import NewSupplier from '../../new/page';

export default async function Update({params}) {
    const { id } = await params; // ✅ Await params first, then destructure
    const data= await getData(`suppliers/${id}`);
  return (
        <NewSupplier initialData={data} isUpdate={true}/>
  )
}
