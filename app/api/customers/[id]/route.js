import { requireAuth } from "@/lib/auth/apiAuthMiddleware";
import { NextResponse } from "next/server";

/**
 * PUT - Update a customer
 */
export async function PUT(request, { params }) {
  const { session, error } = await requireAuth(request);
  if (error) return error;



  try {
    const { id } = await params;
    const { name, email, phone, address, taxId, notes } = await request.json();

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



    const customer = await prisma.customer.update({
      where: { id },
      data: {
        name,
        email,
        phone,
        address,
        taxId,
        notes
      }
    });

    return NextResponse.json(customer);
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      error: error.message,
      message: "Failed to update customer"
    }, {
      status: 500
    });
  }
}





export async function GET(request, {params}) {
    try{
        const { id } = await params;
        const customer =await prisma.brand.findUnique({
            where: {
                id
            },
        });
        return NextResponse.json(customer)
    }
    catch (error){
        console.log(error)
        return NextResponse.json({
            error,
            message:"Failed to Fetch a customer"
        },{
            status:500
        })
    }
}