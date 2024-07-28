import { Request, Response } from "express"
import { ApiResponse, UploadResponse } from "../../types"
import { ObjectId } from "mongodb"
import fs from "fs"

import PicsRepository from "../Repository/PicsRepository"
import ImaginesRepository from "../Repository/ImaginesRepository"
import { genAIModel, genAIPrompt } from "../../genAI"

export default class PicsController {
    static async Init(client: any ) {
        PicsRepository.Init(client)
    }
    static async CreatePic(req: Request, res: Response):Promise<Response<ApiResponse>>{
        let prompt = req.body?.prompt
        if (!prompt) {
            return res.send({
                satus: 500,
                data: null,
                message: "prompt err"
            })
        }
        try {
            let result = await PicsRepository.CreatePic(prompt)
            if (result.done) {
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
                satus: 500,
                data: null,
                message: "file_id parameter err"
            })
        }
        try {
            let _id = new ObjectId(id)
            let result = (await PicsRepository.GetPic(_id)) as UploadResponse
            fs.writeFileSync("gotten.png", result.buffer!)
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
    static async DeletePic(req: Request, res: Response){
        let id = req.params.id
        if (!id) {
            return res.send({
                satus: 500,
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
                satus: 500,
                data: null,
                message: "pic delete err"
            })
        }
    }
}