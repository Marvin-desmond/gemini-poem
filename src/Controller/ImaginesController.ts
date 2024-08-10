import { Request, Response } from "express"
import { ApiResponse, Imagine } from "../types"
import { ObjectId, Collection } from "mongodb"

import ImaginesRepository from "../Repository/ImaginesRepository"
import { generatePrompt } from "../genAI"
import PoemsRepository from "../Repository/PoemsRepository"
export default class ImaginesController {
    static imagines: Collection;
    static async Init(client: any ) {
        ImaginesRepository.Init(client)
    }
    static async CreateImagine(req: Request, res: Response):Promise<Response<ApiResponse>>{
        try {
            let id: string | undefined = req.params.id
            if (!id) {
                return res.send({
                    status: 500,
                    data: null,
                    message: "poem id parameter not passed"
                })
            }
            let _id = new ObjectId(id)
            let result = await PoemsRepository.GetPoem(_id)
            if (!result) {
                return res.send({
                    status: 204,
                    data:null, 
                    message: "poem not found"
                })
            }
            let generated_prompt = await generatePrompt(result.poem)
            await ImaginesRepository.CreateImagine(_id, generated_prompt)
            return res.send({
                status: 200, 
                data: `${generated_prompt}<EOS>`,
                message: "poem imagination complete..."
            })
        } catch(e) {
            return res.send({
                status: 500, 
                data: null,
                message: "tired of imaginations..."
            })
        }
    }
    static async GetImagines(req: Request, res: Response):Promise<Response<ApiResponse>>{
        try {
            let imagines = (await ImaginesRepository.GetImagines()) as Imagine[]
            return res.send({
                status: 200, 
                data: imagines,
                message: "imagines fetched successfully!"
            })
        } catch(e) {
            return res.send({
                status: 500, 
                data: null,
                message: "error fetching imagines!"
            })
        }
    }
    static async UpdateImagine(req: Request, res: Response):Promise<Response<ApiResponse>>{
        try {
            let id: string | undefined = req.params.id
            if (!id) {
                return res.send({
                    status: 500,
                    data: null,
                    message: "poem id parameter not passed"
                })
            }
            let _id = new ObjectId(id)
            let result = await PoemsRepository.GetPoem(_id)
            if (!result) {
                return res.send({
                    status: 204,
                    data:null, 
                    message: "poem not found"
                })
            }
            let generated_prompt = await generatePrompt(result.poem)
            let result_imagine = await ImaginesRepository.UpdateImagine(_id, generated_prompt)
            return res.send({
                status: 200, 
                data: result_imagine,
                message: "poem imagination complete..."
            })
        } catch(e) {
            // @ts-ignore
            console.log(e.errmsg)
            return res.send({
                status: 500, 
                data: null,
                message: "tired of imaginations..."
            })
        }
  }

  static async DeleteImagine(req: Request, res: Response){
    let _poem_id: string | undefined = req.params.id
    if (!_poem_id) {
        return res.send({
            status: 500,
            data: null,
            message: "poem_id parameter err"
        })
    }
    try {
        let _id = new ObjectId(_poem_id)
        let result = await ImaginesRepository.DeleteImagine(_id)
        if (result?.acknowledged) {
            return res.send({
                status: 200, 
                data: result,
                message: "imagine deleted"
            })
        } else {
            return res.send({
                status: 500,
                data: null,
                message: "imagine exec delete err"
            })   
        }
    } catch(e) {
        return res.send({
            status: 500,
            data: null,
            message: "imagine delete err"
        })
    }
}
}