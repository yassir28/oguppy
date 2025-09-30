import Anthropic from "@anthropic-ai/sdk";
import { getInventoryContext, extractRelevantData } from "./chatHelpers";

// Initialize Anthropic client with API key
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Builds the system prompt for Claude with current inventory data
 * This tells Claude what it can do and what data it has access to
 */
function buildSystemPrompt(inventoryData) {
  // If no inventory data available, return basic prompt
  if (!inventoryData) {
    return "You are a helpful inventory assistant. Unfortunately, I cannot access the inventory data right now.";
  }

  const { stats } = inventoryData;

  // Build detailed prompt with current inventory statistics
  return `You are an intelligent inventory management assistant. You have access to real-time inventory data.

CURRENT INVENTORY OVERVIEW:
- Total Items: ${stats.totalItems}
- Total Inventory Value: $${stats.totalValue.toFixed(2)}
- Low Stock Items: ${stats.lowStockCount}
- Out of Stock Items: ${stats.outOfStockCount}
- Warehouses: ${stats.totalWarehouses}

YOUR CAPABILITIES:
1. Answer questions about inventory status
2. Identify low stock or out-of-stock items
3. Calculate inventory values and statistics
4. Provide recommendations for reordering
5. Compare inventory across warehouses
6. Suggest optimal order quantities based on reorder points

RESPONSE GUIDELINES:
- Be concise and direct
- Use bullet points for lists
- Highlight critical issues (out of stock, low stock)
- Provide actionable recommendations
- Always base responses on actual data

When listing items, show the most relevant 5-10 items and mention if there are more.`;
}

/**
 * Main function to process chat messages
 * Gets inventory data, calls Claude API, and returns response
 */
export async function processChatMessage(message, conversationHistory = []) {
  try {
    // Get current inventory data from database
    const inventoryData = await getInventoryContext(message);

    // Build messages array for Claude API
    const messages = [];
    
    // Add previous conversation messages (excluding system messages)
    conversationHistory.forEach(msg => {
      if (msg.role !== 'system') {
        messages.push({
          role: msg.role,
          content: msg.content
        });
      }
    });

    // Add the current user message
    messages.push({
      role: "user",
      content: message
    });

    // Call Claude API with system prompt and messages
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: buildSystemPrompt(inventoryData),
      messages: messages
    });

    // Extract the text response from Claude
    const assistantResponse = response.content[0].text;

    // Extract relevant structured data based on the query
    const relevantData = extractRelevantData(message, inventoryData);

    // Return both the text response and structured data
    return {
      response: assistantResponse,
      data: relevantData
    };

  } catch (error) {
    console.error("Chat service error:", error);
    throw error;
  }
}