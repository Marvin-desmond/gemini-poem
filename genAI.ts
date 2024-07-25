import {GoogleGenerativeAI } from "@google/generative-ai"
import { ENVS } from "./envs"

const genAIModel = () =>{
    const genAI = new GoogleGenerativeAI(ENVS.GEMINI_API_KEY!)
    let model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: { responseMimeType: "application/json" }
      })
    return model
}

const genAIPrompt = (poem: string) => {
      let prompt = `
    imaginatively and with strong text to image generation prompts summarize this
    ${poem}

    and return the prompt for high detail, surrealism photography, octane render, 
    cinematic lighting, video game animation style, high quality prompt to image 
    generator using this JSON schema:
    { "type": "object",
      "properties": {
        "text_prompt": { "type": "string" },
      }
    }`;
    return prompt
}
export { genAIModel, genAIPrompt }

