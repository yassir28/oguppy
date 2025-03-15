"use client"
import FixedHeader from '@/components/dashboard/FixedHeader'
import OptionCard from '@/components/dashboard/OptionCard'
import { Award, Boxes, ScrollText, Shirt, ShirtIcon } from 'lucide-react'
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
        description: "Tweak prices for perfect transactions",
        link: "/side-bar/inventory/brands/new",
        linkTitle:"New Item",
        enabled: true,
        icon: Award
      },
      {
        title: "Warehouse",
        description: "Tweak prices for perfect transactions",
        link: "/side-bar/inventory/warehouse/new",
        linkTitle:"New Item",
        enabled: true,
        icon: Award
      },
      {
        title: "Adjustments",
        description: "Tweak prices for perfect transactions",
        link: "/side-bar/inventory/adjustments/new",
        linkTitle:"New Item",
        enabled: true,
        icon: Award
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
