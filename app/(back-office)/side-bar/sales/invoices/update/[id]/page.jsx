import React from 'react'
import { getData } from '@/lib/getData';
import NewInvoice from '../../new/page';

export default async function Update({ params }) {
  const { id } = await params;
  const data = await getData(`invoices/${id}`);
  
  return (
    <NewInvoice initialData={data} isUpdate={true} />
  )
}