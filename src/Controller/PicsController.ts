import { Request, Response } from "express"
import { ApiResponse, PicMeta, UploadResponse } from "../../types"
import { ObjectId } from "mongodb"
import fs from "fs"

import PicsRepository from "../Repository/PicsRepository"

export default class PicsController {
    static async Init(client: any ) {
        PicsRepository.Init(client)
    }
    static async CreatePic(req: Request, res: Response):Promise<Response<ApiResponse>>{
        let poem_id: string | undefined = req.body?.poem_id
        let prompt: string | undefined = req.body?.prompt
        if (!prompt || !poem_id) {
            return res.send({
                status: 500,
                data: null,
                message: "prompt or poem_id err"
            })
        }
        try {
            let _poem_id = new ObjectId(poem_id)
            let result = await PicsRepository.CreatePic(_poem_id, prompt)
            if (result.stream_done) {
                return res.send({
                    status: 200, 
                    data: result,
                    message: "pic saved"
                })
            } else {
                return res.send({
                    status: 500, 
                    data: result,
                    message: "pic save err"
                })
            }
        } catch(e) {
            return res.send({
                status: 500, 
                data: null,
                message: "pic create err"
            })
        }
    }
    static async GetPic(req: Request, res: Response):Promise<Response<ApiResponse>>{
        let id = req.params.id
        if (!id) {
            return res.send({
                status: 500,
                data: null,
                message: "file_id parameter err"
            })
        }
        try {
            let _id = new ObjectId(id)
            let result = (await PicsRepository.GetPic(_id)) as UploadResponse
            // fs.writeFileSync("gotten.png", result.buffer!)
            result.buffer = Buffer.from(result.buffer!).toString('base64')
            return res.send({
                status: 200, 
                data: result,
                message: "pic fetched"
            })
        } catch(e) {
            return res.send({
                status: 500, 
                data: null,
                message: "pic fetch err"
            })
        }
    }
    static async GetPicMeta(req: Request, res: Response):Promise<Response<ApiResponse>> {
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
            let result = await PicsRepository.GetPicMeta(_id)
            if (result) {
                return res.send({
                    status: 200, 
                    data: result,
                    message: "pics meta fetched"
                })
            } else {
                return res.send({
                    status: 204,
                    data:null, 
                    message: "pics meta not found"
                })
            }
        } catch(e) {
            return res.send({
                status: 500, 
                data: null,
                message: "pics meta fetch err"
            })
        }
    }
    static async GetAllPicMeta(req: Request, res: Response):Promise<Response<ApiResponse>>{
        
        try {
            let allpicsmeta = (await PicsRepository.GetAllPicMeta()) as PicMeta[]
            console.log(allpicsmeta);
            
            return res.send({
                status: 200, 
                data: allpicsmeta,
                message: "pic metadata fetched"
            })
        } catch(e) {
            console.log(e)
            return res.send({
                status: 500, 
                data: null,
                message: "pic metadata fetch err"
            })
        }
    }
    static async UpdatePic(req: Request, res: Response){
        let file_id: string | undefined = req.body.file_id
        let generated_prompt: string | undefined = req.body.prompt
        if (!file_id || !generated_prompt) {
            return res.send({
                status: 500,
                data: null,
                message: "file_id prompt parameter err"
            })
        }
        try { 
            let _file_id = new ObjectId(file_id)
            await PicsRepository.DeletePic(_file_id)
            let result = await PicsRepository.UpdatePic(_file_id, generated_prompt)
            if (result.stream_done) {
                return res.send({
                    status: 200, 
                    data: result,
                    message: "pic updated"
                })
            } else {
                return res.send({
                    status: 500, 
                    data: result,
                    message: "pic udate exec err"
                })
            }
        } catch(e) {
            return res.send({
                status: 500, 
                data: null,
                message: "pic update err"
            })
        }
    }
    static async DeletePic(req: Request, res: Response){
        let id = req.params.id
        if (!id) {
            return res.send({
                status: 500,
                data: null,
                message: "file_id parameter err"
            })
        }
        try {
            let _id = new ObjectId(id)
            await PicsRepository.DeletePic(_id)
            return res.send({
                status: 200, 
                data: null,
                message: "pic deleted"
            })
        } catch(e: any) {
            // console.log(Object.getOwnPropertyNames(e))
            console.log((e as unknown as Error).message)
            return res.send({
                status: 500,
                data: null,
                message: "pic delete err"
            })
        }
    }
}