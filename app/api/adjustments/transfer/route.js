import prisma from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextResponse } from "next/server";

export async function POST(request) {
    try{
        const {
            transferStockQty,
            itemId,
            givingWarehouseId,
            receivingWarehouseId,
            notes,
            referenceNumber
        }= await request.json();

        const item =await prisma.item.findUnique({
                where: {
                    id: itemId,
                }
            })
             

        // Giving warehouse
        const givingWarehouse = await prisma.warehouse.findUnique({
            where: {
                id:givingWarehouseId
            }
        })


        // Get Current Stock
        const currentGivingWarehouseStock = givingWarehouse.stockQty;



        // in case negative
        if(parseInt(currentGivingWarehouseStock)> parseInt(transferStockQty)){
            const newStockForGivingWarehouse =parseInt(currentGivingWarehouseStock) - parseInt(transferStockQty)
            
            // Update Stock
            const updateGivingWarehouse = await prisma.warehouse.update({
                where: {
                    id: givingWarehouseId
                },
                data:{
                    stockQty:newStockForGivingWarehouse
                }
            })


            // Update Item in giving warehouse
            const updatedItemInGivingWarehouse = await prisma.item.update({
                where:{
                    id: itemId,
        
                },
                data:{
                    warehouseId: givingWarehouseId,
                    quantity: newStockForGivingWarehouse
                }

            })



            // get the receiving wareouhe 
            const receivingWarehouse = await prisma.warehouse.findUnique({
                where: {
                    id:receivingWarehouseId
                }
            })




            // Get Current Stock
            const currentReceivingWarehouseStock = receivingWarehouse.stockQty;

            const newStockForReceivingWarehouse =parseInt(currentReceivingWarehouseStock) + parseInt(transferStockQty)
            
            // Update Stock
            const updateReceivingWarehouse = await prisma.warehouse.update({
                where: {
                    id: receivingWarehouseId
                },
                data:{
                    stockQty:newStockForReceivingWarehouse,
                   // items:item
                }
            })

        
            // update the item in receiving warehouse
            const updatedItemInReceivingWarehouse = await prisma.item.update({
                where:{
                    id: itemId,
        
                },
                data:{
                    warehouseId: receivingWarehouseId,
                    quantity: newStockForReceivingWarehouse
                }

            })
            

            const adjustment = await prisma.transferStockAdjustment.create({
                data:{
                    itemId,
                    referenceNumber,
                    transferStockQty: parseInt(transferStockQty),
                    givingWarehouseId,
                    receivingWarehouseId,
                    notes
                },
            });
            console.log(adjustment);
            return NextResponse.json(adjustment);
        }else {
            return NextResponse.json(
            {                
                data:null,
                message:"Giving Warehouse has no enough stock"
            }, {status:409});
        }

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
        const adjustments = await prisma.transferStockAdjustment.findMany({
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
        const  deleteAdjustment = await prisma.transferStockAdjustment.delete({
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