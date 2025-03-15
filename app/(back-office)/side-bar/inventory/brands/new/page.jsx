"use client"

import SubmitButton from '@/components/FormInputs/SubmitButton'
import TextInput from '@/components/FormInputs/TextInput'
import { makePostRequest } from '@/lib/apiRequest'
import {  X } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

export default function NewBrand() {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();
  const [loading, setLoading ] =useState(false);
  async function onSubmit(data) {
    console.log(data )
    setLoading(true)
    const baseUrl ="http://localhost:3000"
    makePostRequest( setLoading, `${baseUrl}/api/brands`, data, "brand", reset)
  }


  return (
    <div>
        {/**header */}
        <div className="flex items-center justify-between py-3 px-16 bg-white">
          <h2 className='text-xl font-semibold'> New Brand</h2>
          <Link href="/side-bar/inventory/">
            <X/>
          </Link>
        </div>
        {/**Form */}
        
        <form onSubmit={
          handleSubmit(onSubmit)} className="w-full max-w-4xl p-4 bg-white 
                                            border border-gray-200 rounded-lg 
                                            shadow sm:p-6 md:p-8 dark:bg-gray-800 
                                            dark:border-gray-700 mx-auto my-3">
          <div className='grid gap-4 sm:grid-cols-2 sm:gap-6'>
          <TextInput label="Brand title" name ="title" register={register} errors={errors} containerWidth='w-full'/>
          <SubmitButton isLoading={loading} title="Brand"/>
          </div>
        </form>
        {/**buttons */}
    </div>
  )
}
