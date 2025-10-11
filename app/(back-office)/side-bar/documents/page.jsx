import {  FileText, Users, DollarSign, TrendingUp } from 'lucide-react'
import FixedHeader from '@/components/dashboard/FixedHeader'
import { getData } from '@/lib/getData';
import DocumentProcessor from '@/components/dashboard/DocumentProcessor';

export default async function Documents() {
  // Fetch data on server
  const invoices = await getData("invoices");
  const customers = await getData("customers");
  
  // Calculate stats
  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const paidInvoices = invoices.filter(i => i.status === 'PAID').length;
  const overdueInvoices = invoices.filter(i => i.status === 'OVERDUE').length;

  return (

    <div>
      {/* Header */}

      <FixedHeader title="Documents & Invoices" newLink="/side-bar/sales/invoices/new" />

      {/* Static stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 m-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Invoices</p>
              <p className="text-2xl font-bold text-gray-900">{invoices.length}</p>
            </div>
            <FileText className="w-10 h-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">${totalRevenue.toFixed(2)}</p>
            </div>
            <DollarSign className="w-10 h-10 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Paid Invoices</p>
              <p className="text-2xl font-bold text-blue-600">{paidInvoices}</p>
            </div>
            <TrendingUp className="w-10 h-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-purple-600">{customers.length}</p>
            </div>
            <Users className="w-10 h-10 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Pass data to client component */}
      <DocumentProcessor invoices={invoices} customers={customers} />
      
      
      {/* Data tables */}



    </div>



  )
}