"use client"

import FormHeader from '@/components/dashboard/FormHeader'
import SubmitButton from '@/components/FormInputs/SubmitButton'
import TextareaInput from '@/components/FormInputs/TextareaInput'
import TextInput from '@/components/FormInputs/TextInput'
import { makePostRequest, makePutRequest } from '@/lib/apiRequest'
import { Plus, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

export default function NewCategory({initialData={}, isUpdate=false}) {
  const router =useRouter()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm(
        {defaultValues: initialData}
  );
  const [loading, setLoading ] =useState(false);

  function redirect(){
    router.replace("/side-bar/inventory/categories/")
  }

  async function onSubmit(data) {
    if(isUpdate){
        //update request
        const baseUrl ="http://localhost:3000"
        makePutRequest( setLoading, `${baseUrl}/api/categories/${initialData.id}`, data, "Category", 
          redirect, reset)
    }else{
        setLoading(true)
        const baseUrl ="http://localhost:3000"
        makePostRequest( setLoading, `${baseUrl}/api/categories`, data, "category", reset)
    }
  }

  return (
    <div>
        {/**header */}

        <FormHeader title={isUpdate?"Update Category": "New Category"} 
            href= "/side-bar/inventory/categories"/>

        
        {/**Form */}
        
        <form onSubmit={
          handleSubmit(onSubmit)} className="w-full max-w-4xl p-4 bg-white 
                                            border border-gray-200 rounded-lg 
                                            shadow sm:p-6 md:p-8 dark:bg-gray-800 
                                            dark:border-gray-700 mx-auto my-3">

          <TextInput label="Category Title" name ="title" register={register} errors={errors}/>
          <TextareaInput name= "description" label="Description" register={register} errors={errors}/>
          <SubmitButton isLoading={loading} title={isUpdate?"Update Category": "New Category"}/>

        </form>
        {/**buttons */}
    </div>
  )
}
