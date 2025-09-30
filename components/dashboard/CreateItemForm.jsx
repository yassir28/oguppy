"use client"
import SelectInput from '@/components/FormInputs/SelectInput'
import SubmitButton from '@/components/FormInputs/SubmitButton'
import TextareaInput from '@/components/FormInputs/TextareaInput'
import TextInput from '@/components/FormInputs/TextInput'
import { makePostRequest, makePutRequest } from '@/lib/apiRequest'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import ImageInput from '../FormInputs/ImageInput'

export default function CreateItemForm({categories,units,brands,warehouses, suppliers, initialData, isUpdate}) {
  const router =useRouter()
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: initialData
  });
  const [loading, setLoading ] =useState(false);
 
  async function onSubmit(data) {
      if(isUpdate){
        //update request
        const baseUrl ="http://localhost:3000"
        makePutRequest( setLoading, `${baseUrl}/api/items/${initialData.id}`, data, "Item", 
          () => router.replace("/side-bar/inventory/items/"), reset)
      }
      else
      {

        console.log(data )
        setLoading(true)
        const baseUrl ="http://localhost:3000"
        makePostRequest( setLoading, `${baseUrl}/api/items`, data, "Item", reset)
      }
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
            <TextInput label="Item SKU" name ="sku" register={register} errors={errors} containerWidth='w-full'/>
            <TextInput label="Item Barcode" name ="barcode" register={register} errors={errors} containerWidth='w-full' isRequired="false" />
            <TextInput label="Item Quantity" name ="qty" register={register} errors={errors} containerWidth='w-full' isRequired="false" />
            <SelectInput name="unitId" label ="Select the Unit" register={register} className="w-full"
                          options ={units} />
            <SelectInput name="brandId" label ="Select the Brand" register={register} className="w-full"
                          options ={brands} />
            <TextInput label="Selling Price" name ="sellingPrice" type="number" register={register} errors={errors} containerWidth='w-full' isRequired="false" />
            <TextInput label="Re-Order Point" name ="reorderPoint" register= {register} type="number" errors={errors} containerWidth='w-full' isRequired="false" />
            <SelectInput name="warehouseId" label ="Select the Item Warehouse" register={register} className="w-full"
                          options ={warehouses} />
            <SelectInput name="supplierId" label ="Select the Supplier" register={register} className="w-full"
                          options ={suppliers} />
            <TextInput label="Item Weight in Kgs" name ="weight" register= {register} type="number" errors={errors} containerWidth='w-full' isRequired="false" />
            <TextInput label="Item Dimensions in cm (20*30*100)" name ="dimensions" register= {register}  errors={errors} containerWidth='w-full' isRequired="false" />
            <TextInput label="Item Tax Rate in percent" name ="taxRate" register= {register}  errors={errors} containerWidth='w-full' isRequired="false" type ="number" />
            <TextareaInput name= "notes" label="Notes" register={register} errors={errors}/>

            <ImageInput
              label="Item Image"
              register={register}
              name="imageUrl"
              setValue={setValue}
              watch={watch}
            />
            <SubmitButton isLoading={loading} title={isUpdate?"Update Item": "New Item"}/>

        </form>
  )
}
