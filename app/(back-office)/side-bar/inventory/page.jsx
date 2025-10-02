"use client"
import FixedHeader from '@/components/dashboard/FixedHeader'
import OptionCard from '@/components/dashboard/OptionCard'
import { Award, Boxes, Home, Plus, ScrollText, Shirt, ShirtIcon, Warehouse } from 'lucide-react'
import React from 'react'
import { useRole } from '@/lib/hooks/useRole'

export default function Inventory() {
  // Get user role information
  const { isAdmin } = useRole();

  // Option cards for ADMIN users (with create links)
  const adminOptionCards = [
    {
      title: "Units",
      description: "Create multiple variants of the same item using Item Groups",
      link: "/side-bar/inventory/units/new",
      linkTitle: "New Unit",
      enabled: true,
      icon: Boxes      
    },
    {
      title: "Items",
      description: "Create groups of items",
      link: "/side-bar/inventory/items/new",
      linkTitle: "New Item",
      enabled: true,
      icon: Shirt
    },
    {
      title: "Categories",
      description: "Bundle categories of the same item using Item Groups",
      link: "/side-bar/inventory/categories/new",
      linkTitle: "New Category",
      enabled: true,
      icon: ScrollText
    },
    {
      title: "Brands",
      description: "Select the Brand for your Items",
      link: "/side-bar/inventory/brands/new",
      linkTitle: "New Brand",
      enabled: true,
      icon: Award
    },
    {
      title: "Warehouse",
      description: "Define your Stock Warehouses",
      link: "/side-bar/inventory/warehouse/new",
      linkTitle: "New Warehouse",
      enabled: true,
      icon: Warehouse
    },
    {
      title: "Adjustments",
      description: "Tweak Adjustments for perfect Stock",
      link: "/side-bar/inventory/adjustments/new",
      linkTitle: "New Adjustment",
      enabled: true,
      icon: Plus
    },
    {
      title: "Suppliers",
      description: "Define your Suppliers for your Stock ammunition",
      link: "/side-bar/inventory/suppliers/new",
      linkTitle: "New Supplier",
      enabled: true,
      icon: Home
    }      
  ];

  // Option cards for regular USER (view only links)
  const userOptionCards = [
    {
      title: "Units",
      description: "Create multiple variants of the same item using Item Groups",
      link: "/side-bar/inventory/units/new",
      linkTitle: "New Unit",
      enabled: true,
      icon: Boxes      
    },
    {
      title: "Items",
      description: "Create groups of items",
      link: "/side-bar/inventory/items/new",
      linkTitle: "New Item",
      enabled: true,
      icon: Shirt
    },
    {
      title: "Categories",
      description: "Bundle categories of the same item using Item Groups",
      link: "/side-bar/inventory/categories/new",
      linkTitle: "New Category",
      enabled: true,
      icon: ScrollText
    },
    {
      title: "Brands",
      description: "Select the Brand for your Items",
      link: "/side-bar/inventory/brands/new",
      linkTitle: "New Brand",
      enabled: true,
      icon: Award
    },
    {
      title: "Warehouse",
      description: "Define your Stock Warehouses",
      link: "/side-bar/inventory/warehouse/new",
      linkTitle: "New Warehouse",
      enabled: true,
      icon: Warehouse
    },
    {
      title: "Adjustments",
      description: "Tweak Adjustments for perfect Stock",
      link: "/side-bar/inventory/adjustments/new",
      linkTitle: "New Adjustment",
      enabled: true,
      icon: Plus
    },
    {
      title: "Suppliers",
      description: "Define your Suppliers for your Stock ammunition",
      link: "/side-bar/inventory/suppliers/new",
      linkTitle: "New Supplier",
      enabled: true,
      icon: Home
    }      
  ];

  // Choose which cards to show based on role
  const optionCards = isAdmin ? adminOptionCards : userOptionCards;


  return (
    <div>
      <FixedHeader newLink="/side-bar/inventory/items/new" />
      
      {/* Show role indicator */}
      <div className="px-16 pt-4">
        <div className={`inline-block px-3 py-1 rounded-full text-sm ${
          isAdmin 
            ? 'bg-purple-100 text-purple-800' 
            : 'bg-blue-100 text-blue-800'
        }`}>
          {isAdmin ? '👑 Admin View' : '👤 User View'}
        </div>
      </div>

      {/* Option Cards Grid */}
      <div className="grid grid-col-1 lg:grid-cols-2 py-8 px-16 gap-6">
        {optionCards.map((card, i) => {
          return (
            <OptionCard optionData={card} key={i}/>
          )
        })}
      </div>
    </div>
  )
}