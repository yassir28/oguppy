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
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        customer: true,
        items: {
          include: {
            item: true
          }
        }
      }
    });

    if (!invoice) {
      return NextResponse.json({
        message: "Invoice not found"
      }, {
        status: 404
      });
    }

    return NextResponse.json(invoice);
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      error: error.message,
      message: "Failed to fetch invoice"
    }, {
      status: 500
    });
  }
}

/**
 * PUT - Update an invoice
 */
export async function PUT(request, { params }) {
  const { session, error } = await requireAuth(request);
  if (error) return error;

  try {
    const { id } = await params;
    const data = await request.json();

    // Check if invoice exists
    const existingInvoice = await prisma.invoice.findUnique({
      where: { id },
      include: { items: true }
    });

    if (!existingInvoice) {
      return NextResponse.json({
        message: "Invoice not found"
      }, {
        status: 404
      });
    }

    // Delete old invoice items
    await prisma.invoiceItem.deleteMany({
      where: { invoiceId: id }
    });

    // Update invoice with new items
    const invoice = await prisma.invoice.update({
      where: { id },
      data: {
        invoiceNumber: data.invoiceNumber,
        customerId: data.customerId,
        invoiceDate: new Date(data.invoiceDate),
        dueDate: new Date(data.dueDate),
        subtotal: data.subtotal,
        taxRate: data.taxRate,
        taxAmount: data.taxAmount,
        discount: data.discount,
        discountAmount: data.discountAmount,
        total: data.total,
        notes: data.notes,
        items: {
          create: data.items.map(item => ({
            itemId: item.itemId || null,
            description: item.description,
            quantity: parseInt(item.quantity),
            unitPrice: parseFloat(item.unitPrice),
            total: parseInt(item.quantity) * parseFloat(item.unitPrice)
          }))
        }
      },
      include: {
        customer: true,
        items: true
      }
    });

    return NextResponse.json(invoice);
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      error: error.message,
      message: "Failed to update invoice"
    }, {
      status: 500
    });
  }
}