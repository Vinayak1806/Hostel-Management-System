import { GoogleGenerativeAI } from '@google/generative-ai'

if (!process.env.GEMINI_API_KEY) {
  console.warn('GEMINI_API_KEY is not defined in environment variables. Chatbot will not work.')
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy_key')
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

export { genAI, model }
