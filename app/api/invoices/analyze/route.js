// app/api/invoices/analyze/route.js
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/apiAuthMiddleware";
import prisma from "@/lib/prisma";
import Anthropic from "@anthropic-ai/sdk";

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * POST /api/invoices/analyze
 * Analyze invoice using Claude AI
 */
export async function POST(request) {
  // Check authentication
  const { session, error } = await requireAuth(request);
  if (error) return error;

  try {
    const { invoiceId, query } = await request.json();

    // Validate input
    if (!invoiceId || !query) {
      return NextResponse.json({
        success: false,
        message: "Invoice ID and query are required"
      }, {
        status: 400
      });
    }

    // Fetch invoice with all related data
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
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
        success: false,
        message: "Invoice not found"
      }, {
        status: 404
      });
    }

    // Build context for Claude
    const invoiceContext = buildInvoiceContext(invoice);

    // Call Claude API
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: buildSystemPrompt(invoice),
      messages: [
        {
          role: "user",
          content: `${invoiceContext}\n\nQuestion: ${query}`
        }
      ]
    });

    // Extract response
    const aiResponse = response.content[0].text;

    return NextResponse.json({
      success: true,
      response: aiResponse,
      invoiceData: {
        invoiceNumber: invoice.invoiceNumber,
        total: invoice.total,
        status: invoice.status,
        dueDate: invoice.dueDate
      }
    });

  } catch (error) {
    console.error("Invoice analysis error:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to analyze invoice",
      error: error.message
    }, {
      status: 500
    });
  }
}

/**
 * Build system prompt for Claude with invoice analysis capabilities
 */
function buildSystemPrompt(invoice) {
  return `You are an intelligent invoice analysis assistant with expertise in accounting, billing, and financial analysis.

INVOICE OVERVIEW:
- Invoice Number: ${invoice.invoiceNumber}
- Customer: ${invoice.customer?.name || 'N/A'}
- Status: ${invoice.status}
- Invoice Date: ${new Date(invoice.invoiceDate).toLocaleDateString()}
- Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}
- Total Amount: $${invoice.total.toFixed(2)}

YOUR CAPABILITIES:
1. Analyze invoice details and line items
2. Identify potential issues (overdue payments, pricing anomalies)
3. Explain invoice calculations (subtotal, tax, discounts)
4. Provide payment status and recommendations
5. Draft payment reminder emails
6. Compare pricing across line items
7. Suggest invoice improvements

RESPONSE GUIDELINES:
- Be professional and concise
- Use clear, business-appropriate language
- Highlight critical information (overdue status, large amounts)
- Provide actionable recommendations when relevant
- Format numbers as currency when applicable
- For email drafts, use professional business tone

Current Date: ${new Date().toLocaleDateString()}`;
}

/**
 * Build detailed invoice context for analysis
 */
function buildInvoiceContext(invoice) {
  const daysUntilDue = Math.ceil((new Date(invoice.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
  const isOverdue = daysUntilDue < 0;
  
  let context = `INVOICE DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Basic Information:
- Invoice Number: ${invoice.invoiceNumber}
- Status: ${invoice.status}
- Invoice Date: ${new Date(invoice.invoiceDate).toLocaleDateString()}
- Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}
${isOverdue ? `- ⚠️ OVERDUE by ${Math.abs(daysUntilDue)} days` : `- Days Until Due: ${daysUntilDue}`}

Customer Information:
- Name: ${invoice.customer?.name || 'N/A'}
- Email: ${invoice.customer?.email || 'N/A'}
- Phone: ${invoice.customer?.phone || 'N/A'}
${invoice.customer?.address ? `- Address: ${invoice.customer.address}` : ''}
${invoice.customer?.taxId ? `- Tax ID: ${invoice.customer.taxId}` : ''}

Financial Breakdown:
- Subtotal: $${invoice.subtotal.toFixed(2)}
${invoice.taxRate > 0 ? `- Tax (${invoice.taxRate}%): $${invoice.taxAmount.toFixed(2)}` : ''}
${invoice.discount > 0 ? `- Discount (${invoice.discount}%): -$${invoice.discountAmount.toFixed(2)}` : ''}
- Total Amount: $${invoice.total.toFixed(2)}

Line Items (${invoice.items?.length || 0} items):`;

  // Add line items
  if (invoice.items && invoice.items.length > 0) {
    invoice.items.forEach((item, index) => {
      context += `
${index + 1}. ${item.description}
   - Quantity: ${item.quantity}
   - Unit Price: $${item.unitPrice.toFixed(2)}
   - Line Total: $${item.total.toFixed(2)}`;
      
      if (item.item) {
        context += `
   - SKU: ${item.item.sku}
   - Available Stock: ${item.item.quantity}`;
      }
    });
  } else {
    context += '\n   (No line items)';
  }

  // Add notes if present
  if (invoice.notes) {
    context += `

Notes/Payment Terms:
${invoice.notes}`;
  }

  context += `

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

  return context;
}