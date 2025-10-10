//Create, Manage and Track invoices and download as pdf, email


import FixedHeader from '@/components/dashboard/FixedHeader'
import DataTable from '@/components/dashboard/DataTable'
import { FileText } from 'lucide-react'
import { getData } from '@/lib/getData';

export default async function Invoices() {
  
  
  const invoices = await getData("invoices")
  
  const invoiceColumns = ["invoiceNumber", "customer.name", "total", "status", "dueDate"];


  return (
    <div>

      {/* Invoices Section */}
      <FixedHeader title="Invoices" newLink="/side-bar/sales/invoices/new" />
      
      <div className="m-4">
        {invoices.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No invoices yet</h3>
            <p className="text-gray-600 mb-4">Create your first invoice to get started</p>
            <a 
              href="/side-bar/sales/invoices/new"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Create Invoice
            </a>
          </div>
        ) : (
          <DataTable 
            data={invoices} 
            columns={invoiceColumns} 
            resourceTitle="invoices"
            section="sales"

          />
        )}
      </div>     
    </div>
  )
}

