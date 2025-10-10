import { requireAuth } from "@/lib/auth/apiAuthMiddleware";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * GET - Fetch a single invoice by ID
 */
export async function GET(request, { params }) {
  const { session, error } = await requireAuth(request);
  if (error) return error;

  try {
    const { id } = await params;
    const invoices = await prisma.invoice.findMany({
      where: { id },
      orderBy: {
          createdAt: 'desc'
      },
    });
    return NextResponse.json(invoices);
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      error: error.message,
      message: "Failed to fetch invoices"
    }, {
      status: 500
    });
  }
}






/**
 * DELETE - Delete a invoice
 * ⚠️ This was missing!
 */
export async function DELETE(request) {
  const { session, error } = await requireAuth(request);
  if (error) return error;

  try {
    const id = request.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json({
        message: "Invoice ID is required"
      }, {
        status: 400
      });
    }

    // Check if invoice exists
    const existingInvoice = await prisma.invoice.findUnique({
      where: { id }
    });

    if (!existingInvoice) {
      return NextResponse.json({
        message: "Invoice not found"
      }, {
        status: 404
      });
    }

    // Delete the invoice
    const deletedInvoice = await prisma.invoice.delete({
      where: { id }
    });

    console.log(`Invoice deleted: ${deletedInvoice.email}`);
    return NextResponse.json(deletedInvoice);

  } catch (error) {
    console.log(error);
    return NextResponse.json({
      error: error.message,
      message: "Failed to delete the invoice"
    }, {
      status: 500
    });
  }
}





/**
 * POST - Update a invoice
 */

export async function POST(request) {
    try{
        const body = await request.json();
        const {
              invoiceNumber,
              customerId,
              invoiceDate,
              dueDate,
              subtotal,
              taxRate,
              taxAmount,
              discount,
              discountAmount,
              total,
              notes
        } = body;
        
        const  invoice = await prisma.invoice.create({
        data:{
              invoiceNumber,
              customerId,
              invoiceDate: new Date(invoiceDate), // ✅ Converts string to Date object
              dueDate: new Date(dueDate),         // ✅ Converts string to Date object
              subtotal: parseFloat(subtotal),
              taxRate: parseFloat(taxRate) || 0,
              taxAmount: parseFloat(taxAmount) || 0,
              discount: parseFloat(discount) || 0,
              discountAmount: parseFloat(discountAmount) || 0,
              total: parseFloat(total),
              status: "DRAFT", // Default status
              notes: notes || null,
            },
            include: {
              customer: true,
              items: {
                include: {
                  item: true
                }
              }
            }
          });

        return NextResponse.json(invoice)
    }
    catch (error){
        console.log(error)
        return NextResponse.json({
            error,
            message:"Failed to create a invoice"
        },{
            status:500
        })
    }
}
