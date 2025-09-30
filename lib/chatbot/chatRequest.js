/**
 * Helper function to send chat messages to the API
 * Follows the same pattern as makePostRequest in apiRequest.js
 * 
 * @param {Function} setLoading - State setter to show/hide loading state
 * @param {String} message - The user's message text
 * @param {Array} conversationHistory - Array of previous messages for context
 * @returns {Object} - { success: boolean, data?: object, error?: string }
 */
export async function sendChatMessage(setLoading, message, conversationHistory) {
    try {
        // Set loading state to true
        setLoading(true);
        
        // Make POST request to chat API
        const response = await fetch('/api/chat', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message,
                conversationHistory
            })
        });

        // Check if request was successful
        if (response.ok) {
            // Parse response data
            const data = await response.json();
            
            // Stop loading
            setLoading(false);
            
            // Return success with data
            return { 
                success: true, 
                data 
            };
        } else {
            // Request failed
            setLoading(false);
            
            return { 
                success: false, 
                error: "Failed to get response" 
            };
        }
    } catch (error) {
        // Network or other error occurred
        setLoading(false);
        console.error("Chat request error:", error);
        
        return { 
            success: false, 
            error: error.message 
        };
    }
}