//Create, Manage and Track invoices and download as pdf, email

"use client"

import FixedHeader from '@/components/dashboard/FixedHeader'
import DataTable from '@/components/dashboard/DataTable'
import { useState, useEffect } from 'react'
import { FileText } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  
  

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [invoicesRes, customersRes] = await Promise.all([
        fetch('/api/invoices'),
        fetch('/api/customers')
      ]);
      
      const invoicesData = await invoicesRes.json();
      const customersData = await customersRes.json();
      
      setInvoices(Array.isArray(invoicesData) ? invoicesData : []);
      setCustomers(Array.isArray(customersData) ? customersData : []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  }


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
              href="/side-bar/documents/invoices/new"
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
          />
        )}
      </div>     
    </div>
  )
}

