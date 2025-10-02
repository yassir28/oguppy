import React from 'react'
import { getData } from '@/lib/getData';
import NewItem from '../../new/page';
import ProtectedRoute from '@/components/auth/ProtectedRoute'



/**
 * Page for updating existing items
 * Protected: Only ADMIN users can access this page
 */

export default async function Update({params}) {
      const { id } = await params; // ✅ Await params first, then destructure

    const data= await getData(`items/${id}`);
  return (
    // Wrap with ProtectedRoute - only ADMIN can update items
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <NewItem initialData={data} isUpdate={true} />
    </ProtectedRoute>        
  )
}
