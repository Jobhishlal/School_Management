import { GoogleGenerativeAI } from "@google/generative-ai";

const APIKEY = process.env.GIMINI_API_KEY

if (!APIKEY) {
    throw new Error("GEMINI_API_KEY is not defined in environment variables")
}

const GenarateApi = new GoogleGenerativeAI(APIKEY as string)

const model = GenarateApi.getGenerativeModel({
    model: "gemini-1.5-flash"
})


export async function askGimini(question: string) {
    const result = await model.generateContent(question)
    return result.response.text()
}