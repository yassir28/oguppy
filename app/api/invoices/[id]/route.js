import { requireAuth } from "@/lib/auth/apiAuthMiddleware";
import { NextResponse } from "next/server";


/**
 * GET - Fetch a single invoice by ID
 */
export async function GET(request, { params }) {
  const { session, error } = await requireAuth(request);
  if (error) return error;

  try {
    const { id } = await params;
    
    // ✅ Use findUnique instead of findMany
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

    // Check if invoice exists
    if (!invoice) {
      return NextResponse.json({
        message: "Invoice not found"
      }, {
        status: 404
      });
    }

    return NextResponse.json(invoice);
  } catch (error) {
    console.error("Error fetching invoice:", error);
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
        subtotal: parseFloat(data.subtotal),
        taxRate: parseFloat(data.taxRate) || 0,
        taxAmount: parseFloat(data.taxAmount) || 0,
        discount: parseFloat(data.discount) || 0,
        discountAmount: parseFloat(data.discountAmount) || 0,
        total: parseFloat(data.total),
        notes: data.notes || null,
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
        items: {
          include: {
            item: true
          }
        }
      }
    });

    console.log("Invoice updated:", invoice.invoiceNumber);
    return NextResponse.json(invoice);

  } catch (error) {
    console.error("Invoice update error:", error);
    return NextResponse.json({
      error: error.message,
      message: "Failed to update invoice"
    }, {
      status: 500
    });
  }
}

/**
 * DELETE - Delete an invoice by ID
 */
export async function DELETE(request, { params }) {
  const { session, error } = await requireAuth(request);
  if (error) return error;

  try {
    const { id } = await params;

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

    // Delete the invoice (cascade deletes invoice items)
    const deletedInvoice = await prisma.invoice.delete({
      where: { id }
    });

    console.log(`Invoice deleted: ${deletedInvoice.invoiceNumber}`);
    return NextResponse.json(deletedInvoice);

  } catch (error) {
    console.error("Invoice delete error:", error);
    return NextResponse.json({
      error: error.message,
      message: "Failed to delete invoice"
    }, {
      status: 500
    });
  }
}