import { Request, Response } from "express"
import { ApiResponse, Poem, PoemExtendPrompt } from "../../types"
import { ObjectId } from "mongodb"

import PoemsRepository from "../Repository/PoemsRepository"
import ImaginesRepository from "../Repository/ImaginesRepository"
import { genAIModel, genAIPrompt } from "../../genAI"

export default class PoemsController {
    static async Init(client: any ) {
        PoemsRepository.Init(client)
    }
    static async GetPoems(req: Request, res: Response):Promise<Response<ApiResponse>>{
        try {
            let poems = (await PoemsRepository.GetPoems()) as PoemExtendPrompt[]
            return res.send({
                status: 200, 
                data: poems,
                message: "poems fetched successfully!"
            })
        } catch(e) {
            return res.send({
                status: 500, 
                data: null,
                message: "error fetching poems!"
            })
        }
    }
    static async GetPoem(req: Request, res: Response):Promise<Response<ApiResponse>> {
        let id = req.params.id
        if (!id) {
            return res.send({
                satus: 500,
                data: null,
                message: "poem id parameter not passed"
            })
        }
        try {
            let _id = new ObjectId(id)
            let result = await PoemsRepository.GetPoem(_id)
            if (result) {
                return res.send({
                    status: 200, 
                    data: result,
                    message: "poem fetched"
                })
            } else {
                return res.send({
                    status: 204,
                    data:null, 
                    message: "poem not found"
                })
            }
        } catch(e) {
            return res.send({
                status: 500, 
                data: null,
                message: "unable to fetch poem"
            })
        }
    }
    static async CreatePoem(req: Request, res: Response):Promise<Response<ApiResponse>>{
        let model = genAIModel()
        let poem: string | undefined = req.body?.poem
        if (!poem) {
            return res.send({
                satus: 500,
                data: null,
                message: "poem not found"
            })
        }
        try {
            let result = await PoemsRepository.CreatePoem(poem)
            if (result.acknowledged) {
                let prompt = genAIPrompt(poem)
                let content = await model.generateContent(prompt)
                let generated_prompt = content.response.text()
                ImaginesRepository.CreateImagine(result.insertedId, generated_prompt)
            }
            return res.send({
                status: 200, 
                data: result,
                message: "poem created successfully!"
            })
        } catch(e) {
            // @ts-ignore
            console.log(e.errmsg)
            return res.send({
                status: 500, 
                data: null,
                message: "error creating poem!"
            })
        }
    }
    static async UpdatePoem(){
        
    }
    static async DeletePoem(){
        
    }
}