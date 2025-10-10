"use client"

import FormHeader from '@/components/dashboard/FormHeader'
import SubmitButton from '@/components/FormInputs/SubmitButton'
import TextInput from '@/components/FormInputs/TextInput'
import TextareaInput from '@/components/FormInputs/TextareaInput'
import { makePostRequest, makePutRequest } from '@/lib/apiRequest'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

export default function NewCustomer({ initialData = {}, isUpdate = false }) {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: initialData
  });

  const [loading, setLoading] = useState(false);

  function redirect() {
    router.replace("/side-bar/sales/customers/")
  }

  async function onSubmit(data) {
    if (isUpdate) {
      // Update request
      const baseUrl = "http://localhost:3000"
      makePutRequest(setLoading, `${baseUrl}/api/customers/${initialData.id}`, data, "Customer", redirect, reset)
    } else {
      setLoading(true);
      const baseUrl = "http://localhost:3000";
      makePostRequest(setLoading, `${baseUrl}/api/customers`, data, "Customer", reset);
    }
  }

  return (
    <div>
      <FormHeader 
        title={isUpdate ? "Update Customer" : "New Customer"} 
        href="/side-bar/sales/customers" 
      />

      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-4xl p-4 bg-white 
                                            border border-gray-200 rounded-lg 
                                            shadow sm:p-6 md:p-8 dark:bg-gray-800 
                                            dark:border-gray-700 mx-auto my-3">
        
        <div className='grid gap-4 sm:grid-cols-2 sm:gap-6'>
          <TextInput 
            label="Customer Name" 
            name="name" 
            register={register} 
            errors={errors} 
            containerWidth='w-full'
          />

          <TextInput 
            label="Email Address" 
            name="email" 
            type="email"
            register={register} 
            errors={errors} 
            containerWidth='w-full'
          />

          <TextInput 
            label="Phone Number" 
            name="phone" 
            type="tel"
            register={register} 
            errors={errors} 
            containerWidth='w-full'
            isRequired={false}
          />

          <TextInput 
            label="Tax ID / VAT Number" 
            name="taxId" 
            register={register} 
            errors={errors} 
            containerWidth='w-full'
            isRequired={false}
          />
        </div>

        <TextareaInput 
          name="address" 
          label="Address" 
          register={register} 
          errors={errors}
          isRequired={false}
        />

        <TextareaInput 
          name="notes" 
          label="Notes" 
          register={register} 
          errors={errors}
          isRequired={false}
        />

        <SubmitButton 
          isLoading={loading} 
          title={isUpdate ? "Update Customer" : "New Customer"} 
        />
      </form>
    </div>
  )
}