//Create, Manage and Track invoices and download as pdf, email

import FixedHeader from '@/components/dashboard/FixedHeader'
import DataTable from '@/components/dashboard/DataTable'
import { Users } from 'lucide-react'
import { getData } from '@/lib/getData';

export default async function Customers() {

  const customers = await getData("customers")
  const customerColumns = ["name", "email", "phone"];



  return (
    <div>

      {/* Customers Section */}
      <div className="mt-8">
        <FixedHeader title="Customers" newLink="/side-bar/sales/customers/new" />
        
        <div className="m-4">
          {customers.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No customers yet</h3>
              <p className="text-gray-600 mb-4">Add your first customer to start creating invoices</p>
              <a 
                href="/side-bar/sales/customers/new"
                className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
              >
                Add Customer
              </a>
            </div>
          ) : (
            <DataTable 
              data={customers} 
              columns={customerColumns} 
              resourceTitle="customers"
              section="sales"
            />
          )}
        </div>
      </div>
    </div>
  )
}