import { processChatMessage } from "@/lib/chatbot/chatService";
import { NextResponse } from "next/server";

/**
 * POST /api/chat
 * Handles incoming chat messages and returns AI responses
 */
export async function POST(request) {
    try {
        // Parse request body
        const body = await request.json();
        const { message, conversationHistory } = body;

        // Validate required fields
        if (!message) {
            return NextResponse.json({
                message: "Message is required"
            }, {
                status: 400
            });
        }

        // Process the chat message using our service
        const result = await processChatMessage(message, conversationHistory);

        // Return the result
        return NextResponse.json(result);
    }
    catch (error) {
        // Log error details
        console.error("Chat API error:", error.message);
        
        // Return error response
        return NextResponse.json({
            message: "Failed to process chat message",
            error: error.message,
        }, {
            status: 500
        });
    }
}