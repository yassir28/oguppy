"use client"
import FixedHeader from '@/components/dashboard/FixedHeader'
import OptionCard from '@/components/dashboard/OptionCard'
import { Award, Boxes, Home, Plus, ScrollText, Shirt, ShirtIcon, Warehouse } from 'lucide-react'
import React from 'react'

export default function inventory() {

  const optionCards = [
      {
        title: "Units",
        description: "Create multiple variants aof the same item using Item Groups",
        link: "/side-bar/inventory/units/new",
        linkTitle:"New Unit",
        enabled: true,
        icon: Boxes      
      },
      {
        title: "Items",
        description: "Create groups of items",
        link: "/side-bar/inventory/items/new",
        linkTitle:"New Item",
        enabled: true,
        icon: Shirt
      },
      {
        title: "Categories",
        description: "Bundle categories of the same item using Item Groups",
        link: "/side-bar/inventory/categories/new",
        linkTitle:"New Category",
        enabled: true,
        icon: ScrollText
      },
      {
        title: "Brands",
        description: "Select the Brand for your Items",
        link: "/side-bar/inventory/brands/new",
        linkTitle:"New Brand",
        enabled: true,
        icon: Award
      },
      {
        title: "Warehouse",
        description: "Define your Stock Warehouses",
        link: "/side-bar/inventory/warehouse/new",
        linkTitle:"New Warehouse",
        enabled: true,
        icon: Warehouse
      },
      {
        title: "Adjustments",
        description: "Tweak Adjustments for perfect Stock",
        link: "/side-bar/inventory/adjustments/new",
        linkTitle:"New Adjustment",
        enabled: true,
        icon: Plus
      },
      {
        title: "Suppliers",
        description: "Define your Suppliers for your Stock amunition",
        link: "/side-bar/inventory/suppliers/new",
        linkTitle:"New Supplier",
        enabled: true,
        icon: Home
      }      
  ]

  return (
    <div>
      <FixedHeader newLink="/side-bar/inventory/items/new"/>
      <div className="grid grid-col-1 lg:grid-cols-2 py-8 px-16 gap-6">
        {optionCards.map((card,i)=>{
          return(
            <OptionCard optionData={card} key={i}/>
          )
        })}

      </div>
    </div>
  )
}
