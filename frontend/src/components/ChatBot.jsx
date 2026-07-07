import { useState, useRef, useEffect } from 'react'
import { MessageSquare, X, Send, Sparkles, Loader2 } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { chatAPI } from '../services'
import { useAuth } from '../context/AuthContext'

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()
  const { isAdmin } = useAuth()

  const suggestions = isAdmin 
    ? ["Room availability", "Payment summary", "Total students"]
    : ["My pending fees", "Attendance this month", "Recent notices"]

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        { role: 'model', text: "Hi! I'm your Hostel Hub AI assistant. Ask me about payments, attendance, complaints, or anything hostel-related!" }
      ])
    }
  }, [isOpen])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const handleSend = async (text) => {
    const msgText = text || inputValue.trim()
    if (!msgText) return

    setInputValue('')
    
    // Add user message to UI immediately
    const userMsg = { role: 'user', text: msgText }
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setIsLoading(true)

    try {
      // Send only previous messages as history (excluding the one just added, and excluding the first welcome message)
      const history = messages
        .filter(m => !m.isError)
        .slice(1) // Skip the first welcome message to ensure history starts with a user message
        .filter(m => m.role === 'user' || m.role === 'model')
        
      const response = await chatAPI.sendMessage(msgText, history, location.pathname)
      
      if (response.action === 'NAVIGATE') {
        navigate(response.path)
      }
      
      setMessages([...updatedMessages, { role: 'model', text: response.reply }])
    } catch (error) {
      console.error('Chat error:', error)
      setMessages([...updatedMessages, { 
        role: 'model', 
        text: "Sorry, I'm having trouble connecting right now. Please try again later.",
        isError: true 
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend()
    }
  }

  return (
    <>
      {/* Chat Bubble Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-[60] p-4 rounded-full shadow-xl transition-all duration-300 flex items-center justify-center ${
          isOpen 
            ? 'bg-gray-800 text-white rotate-90 scale-90 opacity-0' 
            : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-2xl hover:-translate-y-1'
        }`}
      >
        <MessageSquare size={24} />
      </button>

      {/* Chat Panel */}
      <div 
        className={`fixed bottom-6 right-6 z-[60] w-[350px] sm:w-[400px] h-[500px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col border border-gray-200 dark:border-gray-700 transition-all duration-300 origin-bottom-right ${
          isOpen ? 'scale-100 opacity-100' : 'scale-50 opacity-0 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-2xl">
          <div className="flex items-center gap-2">
            <Sparkles size={20} className="text-yellow-300" />
            <div>
              <h3 className="font-bold">Hostel Hub AI</h3>
              <p className="text-xs text-blue-100">Powered by Gemini</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-white/20 rounded-full transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Message List */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900/50 space-y-4 hide-scrollbar">
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : msg.isError
                      ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-bl-none'
                      : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-600 rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* Suggestions if chat is fresh */}
          {messages.length === 1 && !isLoading && (
            <div className="flex flex-wrap gap-2 mt-4">
              {suggestions.map((sug, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(sug)}
                  className="text-xs bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 px-3 py-1.5 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 transition shadow-sm"
                >
                  {sug}
                </button>
              ))}
            </div>
          )}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex items-center gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 rounded-b-2xl">
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-900 rounded-full p-1 pl-4 pr-2">
            <input 
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything..."
              disabled={isLoading}
              className="flex-1 bg-transparent border-none outline-none text-sm text-gray-800 dark:text-gray-200 placeholder-gray-500 py-2"
            />
            <button 
              onClick={() => handleSend()}
              disabled={!inputValue.trim() || isLoading}
              className="p-2 bg-blue-600 text-white rounded-full disabled:opacity-50 hover:bg-blue-700 transition"
            >
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
