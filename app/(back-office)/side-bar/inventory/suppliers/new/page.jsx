"use client"

import FormHeader from '@/components/dashboard/FormHeader'
import SubmitButton from '@/components/FormInputs/SubmitButton'
import TextInput from '@/components/FormInputs/TextInput'
import { makePostRequest, makePutRequest } from '@/lib/apiRequest'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

export default function NewSupplier({initialData={}, isUpdate=false}) {
  const router =useRouter()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: initialData
  });
  const [loading, setLoading ] =useState(false);
  
  function redirect(){
    router.replace("/side-bar/inventory/suppliers/")
  }
  
  async function onSubmit(data) {
      if(isUpdate){
          //update request
          const baseUrl ="http://localhost:3000"
          makePutRequest( setLoading, `${baseUrl}/api/suppliers/${initialData.id}`, data, "Supplier", 
            redirect, reset)
      }else{
          setLoading(true)
          const baseUrl ="http://localhost:3000"
          makePostRequest( setLoading, `${baseUrl}/api/suppliers`, data, "supplier", reset)
      }
  }


  return (
    <div>
        {/**header */}
        <FormHeader title={isUpdate?"Update Supplier": "New Supplier"} 
            href= "/side-bar/inventory/suppliers"/>
        {/**Form */}
        
        <form onSubmit={
          handleSubmit(onSubmit)} className="w-full max-w-4xl p-4 bg-white 
                                            border border-gray-200 rounded-lg 
                                            shadow sm:p-6 md:p-8 dark:bg-gray-800 
                                            dark:border-gray-700 mx-auto my-3">
          <div className='grid gap-4 sm:grid-cols-2 sm:gap-6'>
          <TextInput label="Supplier title" name ="title" register={register} errors={errors} containerWidth='w-full'/>
          <TextInput name= "supplierCode" label="Supplier Code" register={register} errors={errors} containerWidth='w-full'/>
          <SubmitButton isLoading={loading} title={isUpdate?"Update Supplier": "New Supplier"}/>
          </div>
        </form>
        {/**buttons */}
    </div>
  )
}
