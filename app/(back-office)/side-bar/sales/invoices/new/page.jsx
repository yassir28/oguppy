"use client"

import FormHeader from '@/components/dashboard/FormHeader'
import SubmitButton from '@/components/FormInputs/SubmitButton'
import TextInput from '@/components/FormInputs/TextInput'
import SelectInput from '@/components/FormInputs/SelectInput'
import TextareaInput from '@/components/FormInputs/TextareaInput'
import { makePostRequest, makePutRequest } from '@/lib/apiRequest'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'

export default function NewInvoice({ initialData = {}, isUpdate = false }) {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: initialData.id ? initialData : {
      invoiceNumber: `INV-${Date.now()}`,
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      taxRate: 10,
      discount: 0,
    }
  });

  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);
  const [invoiceItems, setInvoiceItems] = useState(
    initialData.items || [{ itemId: '', description: '', quantity: 1, unitPrice: 0 }]
  );

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [customersRes, itemsRes] = await Promise.all([
        fetch('/api/customers'),
        fetch('/api/items')
      ]);
      const customersData = await customersRes.json();
      const itemsData = await itemsRes.json();
      
      setCustomers(Array.isArray(customersData) ? customersData : []);
      setItems(Array.isArray(itemsData) ? itemsData : []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  function redirect() {
    router.replace("/side-bar/sales/invoices/")
  }

  function addItem() {
    setInvoiceItems([...invoiceItems, { itemId: '', description: '', quantity: 1, unitPrice: 0 }]);
  }

  function removeItem(index) {
    if (invoiceItems.length > 1) {
      setInvoiceItems(invoiceItems.filter((_, i) => i !== index));
    }
  }

  function updateItem(index, field, value) {
    const newItems = [...invoiceItems];
    newItems[index][field] = value;

    // Auto-fill from inventory item
    if (field === 'itemId' && value) {
      const item = items.find(i => i.id === value);
      if (item) {
        newItems[index].description = item.title;
        newItems[index].unitPrice = item.sellingPrice;
      }
    }

    setInvoiceItems(newItems);
  }

  function calculateTotals() {
    const subtotal = invoiceItems.reduce((sum, item) => 
      sum + (Number(item.quantity) * Number(item.unitPrice)), 0
    );
    const taxRate = Number(watch('taxRate')) || 0;
    const discount = Number(watch('discount')) || 0;
    const taxAmount = subtotal * (taxRate / 100);
    const discountAmount = subtotal * (discount / 100);
    const total = subtotal + taxAmount - discountAmount;
    
    return { subtotal, taxAmount, discountAmount, total };
  }

  async function onSubmit(data) {
    const totals = calculateTotals();
    const invoiceData = {
      ...data,
      items: invoiceItems,
      subtotal: totals.subtotal,
      taxAmount: totals.taxAmount,
      discountAmount: totals.discountAmount,
      total: totals.total
    };

    if (isUpdate) {
      // Update request
      const baseUrl = "http://localhost:3000"
      makePutRequest(setLoading, `${baseUrl}/api/invoices/${initialData.id}`, invoiceData, "Invoice", redirect, reset)
    } else {
      setLoading(true);
      const baseUrl = "http://localhost:3000";
      makePostRequest(setLoading, `${baseUrl}/api/invoices`, invoiceData, "Invoice", reset);
    }
  }

  const totals = calculateTotals();

  return (
    <div>
      <FormHeader 
        title={isUpdate ? "Update Invoice" : "New Invoice"} 
        href="/side-bar/sales/invoices" 
      />

      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-4xl p-4 bg-white 
                                            border border-gray-200 rounded-lg 
                                            shadow sm:p-6 md:p-8 dark:bg-gray-800 
                                            dark:border-gray-700 mx-auto my-3">
        
        <div className='grid gap-4 sm:grid-cols-2 sm:gap-6'>
          {/* Customer Selection */}
          <SelectInput 
            name="customerId" 
            label="Select Customer" 
            register={register} 
            className="w-full"
            options={customers.map(c => ({ id: c.id, title: c.name }))} 
          />

          {/* Invoice Number */}
          <TextInput 
            label="Invoice Number" 
            name="invoiceNumber" 
            register={register} 
            errors={errors} 
            containerWidth='w-full'
          />

          {/* Invoice Date */}
          <TextInput 
            label="Invoice Date" 
            name="invoiceDate" 
            type="date"
            register={register} 
            errors={errors} 
            containerWidth='w-full'
          />

          {/* Due Date */}
          <TextInput 
            label="Due Date" 
            name="dueDate" 
            type="date"
            register={register} 
            errors={errors} 
            containerWidth='w-full'
          />
        </div>

        {/* Invoice Items Section */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Invoice Items</h3>
            <button
              type="button"
              onClick={addItem}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              + Add Item
            </button>
          </div>

          {invoiceItems.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-3 mb-3 p-3 bg-gray-50 rounded-lg">
              {/* Item Selection */}
              <div className="col-span-4">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Select Item (Optional)
                </label>
                <select
                  value={item.itemId}
                  onChange={(e) => updateItem(index, 'itemId', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                >
                  <option value="">Choose from inventory</option>
                  {items.map(invItem => (
                    <option key={invItem.id} value={invItem.id}>
                      {invItem.title} - ${invItem.sellingPrice}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div className="col-span-3">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <input
                  type="text"
                  required
                  value={item.description}
                  onChange={(e) => updateItem(index, 'description', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  placeholder="Item description"
                />
              </div>

              {/* Quantity */}
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Quantity *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>

              {/* Unit Price */}
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Unit Price *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={item.unitPrice}
                  onChange={(e) => updateItem(index, 'unitPrice', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>

              {/* Remove Button */}
              <div className="col-span-1 flex items-end">
                {invoiceItems.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="w-full px-2 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 text-sm"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Tax and Discount */}
        <div className='grid gap-4 sm:grid-cols-2 sm:gap-6 mt-6'>
          <TextInput 
            label="Tax Rate (%)" 
            name="taxRate" 
            type="number"
            register={register} 
            errors={errors} 
            containerWidth='w-full'
            isRequired={false}
          />

          <TextInput 
            label="Discount (%)" 
            name="discount" 
            type="number"
            register={register} 
            errors={errors} 
            containerWidth='w-full'
            isRequired={false}
          />
        </div>

        {/* Totals Display */}
        <div className="mt-6 bg-blue-50 p-4 rounded-lg">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">${totals.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax ({watch('taxRate')}%):</span>
              <span className="font-medium">${totals.taxAmount.toFixed(2)}</span>
            </div>
            {watch('discount') > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Discount ({watch('discount')}%):</span>
                <span className="font-medium text-red-600">-${totals.discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold border-t border-blue-200 pt-2 mt-2">
              <span className="text-blue-900">Total Amount:</span>
              <span className="text-blue-600">${totals.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="mt-6">
          <TextareaInput 
            name="notes" 
            label="Notes / Payment Terms" 
            register={register} 
            errors={errors}
            isRequired={false}
          />
        </div>

        <SubmitButton 
          isLoading={loading} 
          title={isUpdate ? "Update Invoice" : "New Invoice"} 
        />
      </form>
    </div>
  )
}