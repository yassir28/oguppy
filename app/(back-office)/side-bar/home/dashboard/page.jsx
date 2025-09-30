import DashboardBanner from '@/components/dashboard/DashboardBanner'
import SalesOverview from '@/components/dashboard/SalesOverview'
import React from 'react'
import CurrentStock from '@/components/dashboard/CurrentStock'
import { getData } from '@/lib/getData'

export default async function Dashboard() {
  const items = await getData("items")
  const warehouses = await getData("warehouse")

  const warehousesArray = Array.isArray(warehouses) ? warehouses : [];

  return (

    <div>
        <DashboardBanner/>
        <SalesOverview/>
        <CurrentStock title="Available Stock Items Stock" items = {items}/>
        {warehousesArray.map((warehouse,i)=>{
            return(
              <CurrentStock key={i} title={`Avaialble Stock Items in ${warehouse.title}`} items={warehouse.items}/>
            )
            })
        }
    </div>
  )
}
