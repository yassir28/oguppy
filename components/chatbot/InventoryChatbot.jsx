import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { sendChatMessage } from '@/lib/chatbot/chatRequest';

export default function InventoryChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState('');

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! Ask me about your inventory.",
      timestamp: new Date()
    }
  ]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);




  const handleSendMessage = async (messageText = input) => {

    // Don't proceed if input is empty or we're already loading
    if (!messageText.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: messageText,
      timestamp: new Date()
    };

    // Add user message to chat immediately (optimistic update)
    setMessages(prev => [...prev, userMessage]);

    // Clear input field
    setInput('');

    // Call the API using our helper function
    const result = await sendChatMessage(setIsLoading, messageText, messages);


    // Check if API call was successful
    if (result.success) {
      // Add AI assistant response to messages
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: result.data.response,
        data: result.data.data, // Additional structured data (items, etc.)
        timestamp: new Date()
      }]);
    } else {
      // Add error message to chat if API failed
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Sorry, something went wrong. Please try again.",
        timestamp: new Date()
      }]);
    }
  };


  // Handle Enter key press to send message

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };


  return (
    <>
          {/* Floating chat button - only shown when chat is closed */}

      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-12 h-12 bg-blue-700 hover:bg-blue-800 text-white rounded-full shadow-lg flex items-center justify-center z-50"
        >
          <MessageCircle className="w-5 h-5" />
        </button>
      )}
      {/* Chat window - only shown when isOpen is true */}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 h-96 bg-white rounded-lg shadow-xl flex flex-col z-50 border">

                    {/* Chat header */}
          <div className="bg-blue-700 text-white p-3 rounded-t-lg flex items-center justify-between">
            <span className="text-sm font-medium">Inventory Assistant</span>
            <button onClick={() => setIsOpen(false)} className="hover:bg-blue-800 p-1 rounded">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages container - scrollable */}

          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] rounded-lg p-2 text-sm ${
                  message.role === 'user' 
                    ? 'bg-blue-700 text-white' 
                    : 'bg-white border'
                }`}>

                  {/* Message text content */}
                  <p className="whitespace-pre-wrap">{message.content}</p>

                  {/* Show structured item data if available (from AI response) */}
                  {message.data?.items && (
                    <div className="mt-2 pt-2 border-t text-xs space-y-1">
                      {/* Show first 5 items */}
                      {message.data.items.slice(0, 5).map((item, idx) => (
                        <div key={idx} className="flex justify-between gap-2">
                          <span className="truncate">{item.title}</span>
                          <span className="text-gray-500">{item.quantity}</span>
                        </div>
                      ))}
                      {/* Show count of remaining items if more than 5 */}
                      {message.data.items.length > 5 && (
                        <p className="text-gray-500 italic">+{message.data.items.length - 5} more</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Loading indicator - three bouncing dots */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border rounded-lg p-2 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              </div>
            )}

            {/* Invisible div at the bottom - used as scroll anchor */}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area at the bottom */}
          <div className="p-3 border-t bg-white rounded-b-lg">
            <div className="flex gap-2">
              {/* Text input field */}
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about inventory..."
                disabled={isLoading}
                className="flex-1 px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none disabled:bg-gray-100"
              />
              {/* Send button */}
              <button
                onClick={() => handleSendMessage()}
                disabled={!input.trim() || isLoading}
                className="bg-blue-700 text-white p-2 rounded-md hover:bg-blue-800 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}