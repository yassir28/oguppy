import { requireAdmin, requireAuth } from "@/lib/auth/apiAuthMiddleware";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function POST(request) {

    // Check if user is authenticated and is an ADMIN
    const { session, error } = await requireAdmin(request);

    // If there's an error (not authenticated or not admin), return it
    if (error) return error;

    try{

        const body = await request.json();
        const {
            imageUrl, title, categoryId, 
            sku, barcode,
            qty,unitId,brandId,
            sellingPrice, reorderPoint,
            warehouseId,weight,dimensions,
            taxRate,notes, supplierId 
        }= body;

        // Validate required fields
        if (!categoryId || !unitId || !brandId || !warehouseId || !supplierId) {
            return NextResponse.json({
                message: "Missing required fields",
                missing: {
                    categoryId: !categoryId,
                    unitId: !unitId,
                    brandId: !brandId,
                    warehouseId: !warehouseId,
                    supplierId: !supplierId
                }
            }, {
                status: 400
            });
        }        
        // Get the warehouse
        const warehouse = await prisma.warehouse.findUnique({
            where: {
                id: warehouseId
            }
        })
        if (!warehouse) {
            return NextResponse.json({
                message: "Warehouse not found"
            }, {
                status: 404
            });
        }
        
        // Update warehouse stock quantity
        const currentWarehouseStock = warehouse.stockQty;
        const newStockQty = parseInt(currentWarehouseStock) + parseInt(qty);
        
        await prisma.warehouse.update({
        where: { id: warehouseId },
        data: { stockQty: newStockQty }
        });


        const  item = await prisma.item.create({
        data:{
            // db: front
            imageUrl,
        title: title,
        categoryId: categoryId,
        sku: sku,
        barcode: barcode,
        quantity: parseInt(qty), 
        unitId: unitId,
        brandId: brandId,
        sellingPrice: parseFloat(sellingPrice),
        reOrderPoint: parseInt(reorderPoint),
        warehouseId: warehouseId,
        supplierId: supplierId, 
        weight: weight ? parseFloat(weight) : null,
        dimensions: dimensions,
        taxRate: parseFloat(taxRate),
        notes: notes,
            }
       });

        console.log(`Item created by ADMIN: ${session.user.email}`);
        return NextResponse.json(item)
    }
    catch (error){     
        // Log the error properly
        console.error("Error creating item:", error.message);
        console.error("Stack trace:", error.stack);

        return NextResponse.json({
            message: "Failed to create an item",
            error: error.message, // Only return the error message, not the full error object
        },{
            status:500
        })
    }
}



/**
 * GET - Fetch all items
 * Protected: Any authenticated user can view items
 */
export async function GET(request) {
    // Check if user is authenticated (both USER and ADMIN can view)
    const { session, error } = await requireAuth(request);
  
    if (error) return error;

    try {
        const items = await prisma.item.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                category: true,
                warehouse: true,
                unit: true,
                brand: true,
                supplier: true
            }
        });
        return NextResponse.json(items);
    }
    catch (error) {
        console.error("Error fetching items:", error.message);
        return NextResponse.json({
            message: "Failed to fetch items",
            error: error.message,
        }, {
            status: 500
        });
    }
}




/**
 * DELETE - Delete an item
 * Protected: Only ADMIN can delete items
 */

export async function DELETE(request) {
    // Check if user is authenticated and is an ADMIN
    const { session, error } = await requireAdmin(request);
    
    if (error) return error;    
    try {
        const id = request.nextUrl.searchParams.get("id");
        
        // Get the item to retrieve its quantity and warehouseId
        const itemToDelete = await prisma.item.findUnique({
            where: { id },
            select: {
                quantity: true,
                warehouseId: true
            }
        });

        if (!itemToDelete) {
        return NextResponse.json({
            message: "Item not found"
        }, {
            status: 404
        });
        }
        // Delete the item
        const deletedItem = await prisma.item.delete({
            where: { id }
        });

        // Update the warehouse stock
        await prisma.warehouse.update({
            where: { id: itemToDelete.warehouseId },
            data: {
                stockQty: {
                    decrement: itemToDelete.quantity
                }
            }
        });
    console.log(`Item deleted by ADMIN: ${session.user.email}`);

        return NextResponse.json(deletedItem);
    }
    catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: "Failed to delete item" },
            { status: 500 }
        );
    }
}