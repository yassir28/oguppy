"use client"
import { X } from 'lucide-react';
import React from 'react'

export default function FormHeader({href, title}) {
  return (
        <div className="flex items-center justify-between py-3 px-16 bg-white">
          <h2 className='text-xl font-semibold'> {title}</h2>
          <a href={href} >
            <X/>
          </a>
        </div>
    );
}

