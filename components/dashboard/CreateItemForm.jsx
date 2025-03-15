"use client"
import SelectInput from '@/components/FormInputs/SelectInput'
import SubmitButton from '@/components/FormInputs/SubmitButton'
import TextareaInput from '@/components/FormInputs/TextareaInput'
import TextInput from '@/components/FormInputs/TextInput'
import { makePostRequest } from '@/lib/apiRequest'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

export default function CreateItemForm({categories,units,brands,warehouses}) {

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
    makePostRequest( setLoading, `${baseUrl}/api/items`, data, "Item", reset)
  }


  return (
        <form onSubmit={
          handleSubmit(onSubmit)} className="w-full max-w-4xl p-4 bg-white 
                                            border border-gray-200 rounded-lg 
                                            shadow sm:p-6 md:p-8 dark:bg-gray-800 
                                            dark:border-gray-700 mx-auto my-3">
            
            <TextInput label="Item Title" name ="title" register={register} errors={errors} containerWidth='w-full'/>
            <SelectInput name="categoryId" label ="Select the Item category" register={register} className="w-full"
                          options ={categories} />
            <TextInput label="Item SKU" name ="SKU" register={register} errors={errors} containerWidth='w-full'/>
            <TextInput label="Item Barcode" name ="Barcode" register={register} errors={errors} containerWidth='w-full' isRequired="false" />
            <TextInput label="Item Quantity" name ="Qty" register={register} errors={errors} containerWidth='w-full' isRequired="false" />
            <SelectInput name="UnitId" label ="Select the Unit" register={register} className="w-full"
                          options ={units} />
            <SelectInput name="BrandId" label ="Select the Brand" register={register} className="w-full"
                          options ={brands} />
            <TextInput label="Selling Price" name ="SellingPrice" type="number" register={register} errors={errors} containerWidth='w-full' isRequired="false" />
            <TextInput label="Re-Order Point" name ="ReorderPoint" register= {register} type="number" errors={errors} containerWidth='w-full' isRequired="false" />
            <SelectInput name="WarehouseId" label ="Select the Item Warehouse" register={register} className="w-full"
                          options ={warehouses} />
            <TextInput label="Item Weight in Kgs" name ="weight" register= {register} type="number" errors={errors} containerWidth='w-full' isRequired="false" />
            <TextInput label="Item Dimensions in cm (20*30*100)" name ="dimensions" register= {register}  errors={errors} containerWidth='w-full' isRequired="false" />
            <TextInput label="Item Tax Rate in percent" name ="taxRate" register= {register}  errors={errors} containerWidth='w-full' isRequired="false" type ="number" />
            <TextareaInput name= "Item Notes" label="Notes" register={register} errors={errors}/>
            <SubmitButton isLoading={loading} title="Item"/>
        </form>
  )
}
