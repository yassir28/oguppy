import { requireAuth } from "@/lib/auth/apiAuthMiddleware";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * GET - Fetch a single customer by ID
 */
export async function GET(request, { params }) {
  const { session, error } = await requireAuth(request);
  if (error) return error;

  try {
    const customers = await prisma.customer.findMany({
       orderBy: {
                createdAt: 'desc'
            },
    });

    return NextResponse.json(customers);
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      error: error.message,
      message: "Failed to fetch customer"
    }, {
      status: 500
    });
  }
}



/**
 * POST - Update a customer
 */

export async function POST(request) {
    try{
        const body = await request.json();
        const {
                id        ,
                name      ,
                email         ,
                phone     ,
                address   ,
                taxId     ,
                notes     ,
                createdAt   ,
                updatedAt   
        } = body;
        
        //const brand= {title}

        const  customer = await prisma.customer.create({
        data:{
                id: id,          
                name:  name,         
                email   :email,      
                phone      : phone,   
                address    : address, 
                taxId      : taxId,   
                notes      : notes   ,
                createdAt     : createdAt,
                updatedAt     :updatedAt

            }
       });


        console.log(customer)
        return NextResponse.json(customer)
    }
    catch (error){
        console.log(error)
        return NextResponse.json({
            error,
            message:"Failed to create a customer"
        },{
            status:500
        })
    }
}



/**
 * DELETE - Delete a customer
 * ⚠️ This was missing!
 */
export async function DELETE(request) {
  const { session, error } = await requireAuth(request);
  if (error) return error;

  try {
    const id = request.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json({
        message: "Customer ID is required"
      }, {
        status: 400
      });
    }

    // Check if customer exists
    const existingCustomer = await prisma.customer.findUnique({
      where: { id }
    });

    if (!existingCustomer) {
      return NextResponse.json({
        message: "Customer not found"
      }, {
        status: 404
      });
    }

    // Delete the customer
    const deletedCustomer = await prisma.customer.delete({
      where: { id }
    });

    console.log(`Customer deleted: ${deletedCustomer.email}`);
    return NextResponse.json(deletedCustomer);

  } catch (error) {
    console.log(error);
    return NextResponse.json({
      error: error.message,
      message: "Failed to delete the customer"
    }, {
      status: 500
    });
  }
}