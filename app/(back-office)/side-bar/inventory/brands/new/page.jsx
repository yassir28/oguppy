"use client"

import FormHeader from '@/components/dashboard/FormHeader'
import SubmitButton from '@/components/FormInputs/SubmitButton'
import TextInput from '@/components/FormInputs/TextInput'
import { makePostRequest, makePutRequest } from '@/lib/apiRequest'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

export default function NewBrand({initialData={}, isUpdate=false}) {
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
    router.replace("/side-bar/inventory/brands/")
  }
  
  async function onSubmit(data) {
      if(isUpdate){
          //update request
          const baseUrl ="http://localhost:3000"
          makePutRequest( setLoading, `${baseUrl}/api/brands/${initialData.id}`, data, "Brand", 
            redirect, reset)
      }else{
          setLoading(true)
          const baseUrl ="http://localhost:3000"
          makePostRequest( setLoading, `${baseUrl}/api/brands`, data, "brand", reset)
      }
  }


  return (
    <div>
        {/**header */}
        <FormHeader title={isUpdate?"Update Brand": "New Brand"} 
            href= "/side-bar/inventory/brands"/>
        {/**Form */}
        
        <form onSubmit={
          handleSubmit(onSubmit)} className="w-full max-w-4xl p-4 bg-white 
                                            border border-gray-200 rounded-lg 
                                            shadow sm:p-6 md:p-8 dark:bg-gray-800 
                                            dark:border-gray-700 mx-auto my-3">
          <div className='grid gap-4 sm:grid-cols-2 sm:gap-6'>
          <TextInput label="Brand title" name ="title" register={register} errors={errors} containerWidth='w-full'/>
          <SubmitButton isLoading={loading} title={isUpdate?"Update Brand": "New Brand"}/>
          </div>
        </form>
        {/**buttons */}
    </div>
  )
}
