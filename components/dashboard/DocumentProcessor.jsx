// components/dashboard/DocumentsClient.jsx
"use client"

import { useState } from 'react'
import { MessageSquare, Printer } from 'lucide-react'
import toast from 'react-hot-toast'

export default function DocumentProcessor({ invoices, customers }) {
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  async function analyzeInvoice() {
    if (!selectedInvoice || !aiQuery.trim()) {
      toast.error('Please select an invoice and enter a question');
      return;
    }

    setAiLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/invoices/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceId: selectedInvoice.id,
          query: aiQuery
        })
      });

      const data = await response.json();
      if (data.success) {
        setAiResponse(data.response);
        toast.success('AI analysis complete!');
      } else {
        toast.error('Analysis failed');
      }
    } catch (error) {
      console.error('Error analyzing invoice:', error);
      toast.error('AI analysis failed');
    } finally {
      setAiLoading(false);
    }
  }

  function printInvoice(invoice) {
    const printWindow = window.open('', '', 'height=800,width=600');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice ${invoice.invoiceNumber}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
            .header { border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; }
            .header h1 { color: #2563eb; font-size: 32px; }
            .header-right { text-align: right; }
            .section { margin: 20px 0; }
            .section h3 { color: #2563eb; margin-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th { background: #2563eb; color: white; padding: 12px; text-align: left; }
            td { padding: 12px; border-bottom: 1px solid #ddd; }
            .totals { text-align: right; margin-top: 20px; }
            .totals div { padding: 8px 0; }
            .total-amount { font-size: 24px; font-weight: bold; color: #2563eb; border-top: 2px solid #2563eb; padding-top: 12px; margin-top: 10px; }
            .status { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold; }
            .status-draft { background: #e5e7eb; color: #1f2937; }
            .status-paid { background: #d1fae5; color: #065f46; }
            .status-sent { background: #dbeafe; color: #1e40af; }
            .status-overdue { background: #fee2e2; color: #991b1b; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1>INVOICE</h1>
              <p>Your Company Name</p>
              <p>123 Business Street</p>
              <p>City, State 12345</p>
            </div>
            <div class="header-right">
              <p><strong>Invoice #:</strong> ${invoice.invoiceNumber}</p>
              <p><strong>Date:</strong> ${new Date(invoice.invoiceDate).toLocaleDateString()}</p>
              <p><strong>Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString()}</p>
              <p><span class="status status-${invoice.status.toLowerCase()}">${invoice.status}</span></p>
            </div>
          </div>
          
          <div class="section">
            <h3>Bill To:</h3>
            <p><strong>${invoice.customer?.name || 'N/A'}</strong></p>
            <p>${invoice.customer?.email || ''}</p>
            ${invoice.customer?.phone ? `<p>${invoice.customer.phone}</p>` : ''}
            ${invoice.customer?.address ? `<p>${invoice.customer.address}</p>` : ''}
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th style="text-align: center;">Quantity</th>
                <th style="text-align: right;">Unit Price</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${(invoice.items || []).map(item => `
                <tr>
                  <td>${item.description}</td>
                  <td style="text-align: center;">${item.quantity}</td>
                  <td style="text-align: right;">$${item.unitPrice.toFixed(2)}</td>
                  <td style="text-align: right;">$${item.total.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="totals">
            <div><strong>Subtotal:</strong> $${invoice.subtotal.toFixed(2)}</div>
            ${invoice.taxRate > 0 ? `<div><strong>Tax (${invoice.taxRate}%):</strong> $${invoice.taxAmount.toFixed(2)}</div>` : ''}
            ${invoice.discount > 0 ? `<div style="color: #dc2626;"><strong>Discount (${invoice.discount}%):</strong> -$${invoice.discountAmount.toFixed(2)}</div>` : ''}
            <div class="total-amount">Total: $${invoice.total.toFixed(2)}</div>
          </div>
          
          ${invoice.notes ? `
            <div class="section" style="margin-top: 40px; padding: 15px; background: #f9fafb; border-left: 4px solid #2563eb;">
              <h3>Notes:</h3>
              <p>${invoice.notes}</p>
            </div>
          ` : ''}
          
          <div style="margin-top: 60px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #999; font-size: 12px;">
            <p>Thank you for your business!</p>
            <p>Generated on ${new Date().toLocaleDateString()}</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 250);
  }

  return (
    <div className="m-4 bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <MessageSquare className="w-6 h-6 text-purple-600" />
        AI Invoice Assistant
      </h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Invoice Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Invoice to Analyze
          </label>
          <select
            value={selectedInvoice?.id || ''}
            onChange={(e) => {
              const invoice = invoices.find(inv => inv.id === e.target.value);
              setSelectedInvoice(invoice);
              setAiResponse('');
            }}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:outline-none"
          >
            <option value="">Choose an invoice...</option>
            {invoices.map(inv => (
              <option key={inv.id} value={inv.id}>
                {inv.invoiceNumber} - {inv.customer?.name} - ${inv.total.toFixed(2)}
              </option>
            ))}
          </select>

          {selectedInvoice && (
            <div className="mt-4 p-4 bg-purple-50 rounded-lg">
              <p className="text-sm font-medium text-purple-900 mb-2">Selected Invoice:</p>
              <p className="text-sm text-gray-700"><strong>Number:</strong> {selectedInvoice.invoiceNumber}</p>
              <p className="text-sm text-gray-700"><strong>Customer:</strong> {selectedInvoice.customer?.name}</p>
              <p className="text-sm text-gray-700"><strong>Total:</strong> ${selectedInvoice.total.toFixed(2)}</p>
              <p className="text-sm text-gray-700"><strong>Status:</strong> {selectedInvoice.status}</p>
              <button
                onClick={() => printInvoice(selectedInvoice)}
                className="mt-3 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 text-sm flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Print/Download PDF
              </button>
            </div>
          )}
        </div>

        {/* AI Query */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ask AI About This Invoice
          </label>
          
          {/* Quick Questions */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            {[
              'Explain this invoice',
              'Any issues?',
              'Payment due when?',
              'Send payment reminder'
            ].map((q) => (
              <button
                key={q}
                onClick={() => setAiQuery(q)}
                className="text-left text-xs px-3 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!selectedInvoice}
              >
                {q}
              </button>
            ))}
          </div>

          <textarea
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            placeholder={selectedInvoice ? "Ask anything about this invoice..." : "Select an invoice first"}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            rows={3}
            disabled={!selectedInvoice}
          />

          <button
            onClick={analyzeInvoice}
            disabled={!selectedInvoice || !aiQuery.trim() || aiLoading}
            className="w-full mt-3 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {aiLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Analyzing...
              </span>
            ) : (
              '🤖 Analyze with AI'
            )}
          </button>

          {/* AI Response */}
          {aiResponse && (
            <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-sm font-medium text-purple-900 mb-2">✨ AI Response:</p>
              <div className="text-sm text-gray-700 whitespace-pre-wrap">
                {aiResponse}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}