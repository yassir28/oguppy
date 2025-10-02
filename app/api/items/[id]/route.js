
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";


/**

 * GET - Fetch a single item by ID
 * Protected: Any authenticated user can view a single item
 */

export async function GET(request, {params}) {
  // Check if user is authenticated
  const { session, error } = await requireAuth(request);
  
  if (error) return error;

    try{
        const { id } = await params;
        const item =await prisma.item.findUnique({
            where: {
                id
            },
        });
    if (!item) {
      return NextResponse.json({
        message: "Item not found"
      }, {
        status: 404
      });
    }

        return NextResponse.json(item)
    }
    catch (error){
        console.log(error)
        return NextResponse.json({
            error,
            message:"Failed to Fetch a item"
        },{
            status:500
        })
    }
}


/**
 * PUT - Update an item
 * Protected: Only ADMIN can update items
 */
export async function PUT(request, {params}) {
  // Check if user is authenticated and is an ADMIN
  const { session, error } = await requireAdmin(request);
  
  if (error) return error;


    try{
        const { id } = await params;
        const  {imageUrl,title,  sku, barcode,  qty, sellingPrice, weight,dimensions, taxRate,notes} = await request.json()


    // Check if item exists
    const existingItem = await prisma.item.findUnique({
      where: { id }
    });

    if (!existingItem) {
      return NextResponse.json({
        message: "Item not found"
      }, {
        status: 404
      });
    }                    
        const item =await prisma.item.update({
            where: {
                id
            },
            data:{ // db: front
                imageUrl,
                title: title,
                sku: sku,
                barcode: barcode,
                quantity: parseInt(qty), 
                sellingPrice: parseFloat(sellingPrice),
                weight: weight ? parseFloat(weight) : null,
                dimensions: dimensions,
                taxRate: parseFloat(taxRate),
                notes: notes,
            }
        });
        return NextResponse.json(item)
    }
    catch (error){
        console.log(error)
        return NextResponse.json({
            error,
            message:"Failed to update the item"
        },{
            status:500
        })
    }
}



/**
 * DELETE - Delete an item
 * Protected: Only ADMIN can delete items
 * Note: This is redundant with the DELETE in route.js
 * You might want to remove one of them
 */
export async function DELETE(request, { params }) {
  // Check if user is authenticated and is an ADMIN
  const { session, error } = await requireAdmin(request);
  
  if (error) return error;

  try {
    const { id } = await params;
    
    // Get the item first
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

    // Update warehouse stock
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
    
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      error: error.message,
      message: "Failed to delete the item"
    }, {
      status: 500
    });
  }
}