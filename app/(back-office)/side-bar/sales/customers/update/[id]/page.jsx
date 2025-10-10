import React from 'react'
import { getData } from '@/lib/getData';
import NewCustomer from '../../new/page';

export default async function Update({ params }) {
  const { id } = await params;
  const data = await getData(`customers/${id}`);
  
  return (
    <NewCustomer initialData={data} isUpdate={true} />
  )
}