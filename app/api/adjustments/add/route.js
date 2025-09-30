import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request) {
    try{
        const {
            addStockQty,
            receivingWarehouseId,
            notes,
            referenceNumber,
            itemId,
            supplierId
        }= await request.json();


        // Get the item
        const itemToUpdate = await prisma.item.findUnique({
            where:{
                id:itemId
            }
        })

        // Current Item Quanitity 
        const currentItemQuantity = itemToUpdate.quantity;
        const newQty = parseInt(currentItemQuantity)  + parseInt(addStockQty) 


        // modify the item to the new quantity
        const updatedItem = await prisma.item.update({
            where: {
                id: itemId
            },
            data:{
                quantity: newQty
            }
        });

        
        // Get the warehouse
        const warehouse = await prisma.warehouse.findUnique({
            where: {
                id: receivingWarehouseId
            }
        })
        
        // current stock of the warehouse 
        const currentWarehouseStock = warehouse.stockQty;
        const newStockQty = parseInt(currentWarehouseStock) +parseInt(addStockQty)
        // Update the stock on the warehouse
        const updatedWarehouse = await prisma.warehouse.update({
            where: {
                id: receivingWarehouseId
            },
            data: {
                stockQty:newStockQty
            }
        })

        
        const adjustment = await prisma.addStockAdjustment.create({
            data:{
                itemId,
                referenceNumber,
                addStockQty: parseInt(addStockQty),
                receivingWarehouseId,
                notes,
                supplierId
            },
        });





        // affect the warehouse



        return NextResponse.json(adjustment);
    } catch (error){
                console.log(error);
return NextResponse.json(
            {
                error,
                message: "Failed to create adjustment",
            },
            {
                status:500
            }
        )
    }
}



export async function GET(request) {
    try {
        const adjustments = await prisma.addStockAdjustment.findMany({
            orderBy: {
                createdAt: 'desc'
            },
        });
        return NextResponse.json(adjustments);
    }
    catch (error) {
        console.error("Error fetching items:", error.message);
        return NextResponse.json({
            message: "Failed to fetch an adjustment",
            error: error.message,
        }, {
            status: 500
        });
    }
}



export async function DELETE(request) {
    try{
        const id = request.nextUrl.searchParams.get("id")
        const  deleteAdjustment = await prisma.addStockAdjustment.delete({
        where:{
                id
            }
       });        
        return NextResponse.json(deleteAdjustment)
    }
    catch (error){
        console.log(error)
        return NextResponse.json({
            error,
            message:"Failed to delete the adjustment"
        },{
            status:500
        })
    }
}