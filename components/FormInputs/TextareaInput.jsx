import React from 'react'
import { useFormState } from 'react-hook-form'

export default function TextareaInput({label, name, isRequired=true, register, errors, type=" text", containerWidth= "sm:col-span-2"}) {

  return (
    <div>
        <div className= {containerWidth}>
            <label
              htmlFor={name}
              className="block text-sm font-medium leading-6 text-gray-900 mb-2 "
            >
              {label}
            </label>

                      
            <textarea  {...register(name, { required: isRequired })}
                        type={type}
                        name={name}
                        id={name}
                        autoComplete='given-name'
                        rows="4" 
                        className="block p-2.5 w-full 
                                    text-sm text-gray-900 bg-gray-50 
                                    rounded-lg border border-gray-300 
                                    focus:ring-primary-500 focus:border-primary-500 
                                    dark:bg-gray-700 dark:border-gray-600 
                                    dark:placeholder-gray-400 dark:text-white 
                                    dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                        placeholder="Write product description here"
            />
            {errors[name] && (
            <span className="text-sm text-red-600 ">
                {label} is required
            </span>
            )}                    
        </div>
    </div>
  )
}
