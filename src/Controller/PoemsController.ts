import { Request, Response } from "express"
import { ApiResponse, Poem, PoemExtendPrompt } from "../../types"
import { ObjectId } from "mongodb"

import PoemsRepository from "../Repository/PoemsRepository"
import ImaginesRepository from "../Repository/ImaginesRepository"
import { generatePrompt } from "../../genAI"

export default class PoemsController {
    static async Init(client: any ) {
        PoemsRepository.Init(client)
    }
    static async CreatePoem(req: Request, res: Response):Promise<Response<ApiResponse>>{
        let poem: string | undefined = req.body?.poem
        if (!poem) {
            return res.send({
                status: 500,
                data: null,
                message: "poem parameter err"
            })
        }
        try {
            let result = await PoemsRepository.CreatePoem(poem)
            if (result.acknowledged) {
                let generated_prompt = await generatePrompt(poem);
                ImaginesRepository.CreateImagine(result.insertedId, generated_prompt)
            }
            return res.send({
                status: 200, 
                data: result,
                message: "poem created"
            })
        } catch(e) {
            // @ts-ignore
            console.log(e.errmsg)
            return res.send({
                status: 500, 
                data: null,
                message: "poem create err"
            })
        }
    }
    static async GetPoems(req: Request, res: Response):Promise<Response<ApiResponse>>{
        try {
            let poems = (await PoemsRepository.GetPoems()) as PoemExtendPrompt[]
            return res.send({
                status: 200, 
                data: poems,
                message: "poems fetched"
            })
        } catch(e) {
            return res.send({
                status: 500, 
                data: null,
                message: "poems fetch err"
            })
        }
    }
    static async GetPoem(req: Request, res: Response):Promise<Response<ApiResponse>> {
        let id = req.params.id
        if (!id) {
            return res.send({
                status: 500,
                data: null,
                message: "poem_id parameter err"
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
                message: "poem fetch err"
            })
        }
    }
    static async UpdatePoem(req: Request, res: Response){
        let id: string | undefined = req.body.id
        let new_poem: string | undefined = req.body.new_poem
        if (!id || !new_poem) {
            return res.send({
                status: 500,
                data: null,
                message: "poem_id poem_content parameters err"
            })
        }
        try{
            let _id = new ObjectId(id)
            let result = await PoemsRepository.UpdatePoem(_id, new_poem)
            if (result.acknowledged) {
                let generated_prompt = await generatePrompt(new_poem)
                ImaginesRepository.UpdateImagine(_id, generated_prompt)
            }
            return res.send({
                status: 200, 
                data: result,
                message: "poem updated"
            })
        } catch(e) {
            return res.send({
                status: 500,
                data: null,
                message: "update poem err..."
            }) 
        }
    }
    static async DeletePoem(req: Request, res: Response){
        let id = req.params.id
        if (!id) {
            return res.send({
                status: 500,
                data: null,
                message: "poem_id parameter err"
            })
        }
        try {
            let _id = new ObjectId(id)
            let result = await PoemsRepository.DeletePoem(_id)
            if (result?.acknowledged) {
                return res.send({
                    status: 200, 
                    data: result,
                    message: "poem deleted"
                })
            } else {
                return res.send({
                    status: 500,
                    data: null,
                    message: "poem exec delete err"
                })   
            }
        } catch(e) {
            return res.send({
                status: 500,
                data: null,
                message: "poem delete err"
            })
        }
    }
}