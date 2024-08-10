import {GoogleGenerativeAI } from "@google/generative-ai"

import { ENVS } from "./src/envs"

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

const preprocessFile = (buffer: Buffer, mimeType: string) => {
    console.log(buffer.length)
    console.log(mimeType)
    return {
      inlineData: {
        data: Buffer.from(buffer).toString("base64"),
        mimeType
      },
    };
}

const generatePrompt = async (poem: string): Promise<string> => {
  const model = genAIModel();
  let prompt = genAIPrompt(poem);

  const content = await model.generateContent(prompt)
  let generated_prompt = content.response.text()
  // remove prefix {\"text_prompt\": \" and postfix "\"}\n"
  generated_prompt = generated_prompt.slice(17, -3)
  return generated_prompt
}

const generateFilePrompt = async (buffer: Buffer): Promise<string> => {
  const model = genAIModel()
  const fPart = preprocessFile(buffer, "image/png")
  const resp = await model.generateContent([{text: "OCR this image"}, fPart])
  let generated_poem = resp.response.text()
  return generated_poem
}

export { generatePrompt, generateFilePrompt }