import 'dotenv/config'
import { GoogleGenerativeAI } from '@google/generative-ai'

const geminiApiKey = process.env.GEMINI_API_KEY?.trim()

if (!geminiApiKey) {
  console.warn('GEMINI_API_KEY is not defined in environment variables. Chatbot will not work.')
}

const genAI = geminiApiKey ? new GoogleGenerativeAI(geminiApiKey) : null
const model = genAI ? genAI.getGenerativeModel({ model: 'gemini-2.5-flash' }) : null

export { genAI, model, geminiApiKey }
