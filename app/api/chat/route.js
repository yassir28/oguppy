import { processChatMessage } from "@/lib/chatbot/chatService";
import { NextResponse } from "next/server";

/**
 * POST /api/chat
 * Handles chatbot messages and returns AI responses
 */
export async function POST(request) {
  try {
    // Parse request body
    const body = await request.json();
    const { message, conversationHistory = [] } = body;

    // Validate required fields
    if (!message || !message.trim()) {
      return NextResponse.json(
        { 
          success: false,
          message: "Message is required" 
        },
        { status: 400 }
      );
    }

    // Process the chat message using our service
    const result = await processChatMessage(message, conversationHistory);

    // Return successful response
    return NextResponse.json({
      success: true,
      response: result.response,
      data: result.data
    });

  } catch (error) {
    // Log error details for debugging
    console.error("❌ Chat API error:", error);
    
    // Return error response
    return NextResponse.json(
      {
        success: false,
        message: "Failed to process chat message",
        error: error.message,
      },
      { status: 500 }
    );
  }
}