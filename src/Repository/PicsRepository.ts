import { ObjectId, GridFSBucket, Collection } from "mongodb"
import { Readable, Writable } from "node:stream"
import { pipeline } from 'node:stream/promises'
import assert from 'assert'

import { PicMeta, UploadResponse } from "../../types"
import { stableImage } from "../../generateImage"
import { generateSlug } from "random-word-slugs"

export default class PicsRepository {
    static picsMeta?: Collection
    static bucket?: GridFSBucket
    static async Init(client_db: any ) {
        if (this.bucket && this.picsMeta) return
        try {
            this.bucket = new GridFSBucket(client_db)
            this.picsMeta = client_db.collection("picsMeta")            
        } catch (e) {
            console.error(
              `pics repository init fail: ${e}`,
            )
          }
    }

    static async CreatePic(poem_id: ObjectId, generated_prompt: string): Promise<UploadResponse>{
        const result: UploadResponse = {
            stream_done: false,
            meta_done: false,
            file_id: undefined,
            buffer: undefined
        }
        const response = await stableImage(generated_prompt)
        let buffer: Buffer
        let stream_file_name = generateSlug()
        if (response.status === 200) {
            buffer = Buffer.from(response.data)
        } else {
            throw new Error(`error generating buffer`)
        }
        const stream = new Readable({
            read() {
                this.push(buffer);
                this.push(null);
            }
        })
        const upload_stream = this.bucket!.openUploadStream(`${stream_file_name}.png`)
        await pipeline(
            stream,
            upload_stream
        )
        result.file_id = upload_stream.id
        result.stream_done = true
        let result_meta_save = await this.CreatePicMeta(poem_id,result.file_id)
        result.meta_done = result_meta_save.acknowledged
        return result
    }

    static async CreatePicMeta(poem_id: ObjectId, file_id: ObjectId){
        const filter = { poem_id : poem_id },
              update_doc = {
                $set: {
                    file_id: file_id 
                }
              },
              options = { upsert: true };
        const result = await this.picsMeta!.updateOne(filter, update_doc, options)
        return result
    }

    static async GetPic(file_id: ObjectId):Promise<UploadResponse> {
        const result: UploadResponse = {
            stream_done: false,
            meta_done: false,
            file_id: undefined,
            buffer: undefined
        }
        let buffers: any = []
        const bufferStream = new Writable({
            write(chunk, encoding, callback) {
              buffers.push(chunk)
              callback();
            }
          })

        await pipeline(
            this.bucket!.openDownloadStream(file_id),
            bufferStream
        )
        result.stream_done = true;
        result.buffer = Buffer.concat(buffers)
        return result
    }

    static async GetAllPicMeta(): Promise<PicMeta[]> {
        // @ts-ignore
        let allPicsMeta = (await this.picsMeta!.find({}, {_id: 0})).toArray() as PicMeta[]
        return allPicsMeta
    }

    static async GetPicMeta(poem_id: ObjectId):Promise<PicMeta> {
        // @ts-ignore
        let picsMeta = (await this.picsMeta!.findOne({ poem_id: poem_id }, { _id: 0 })) as PicMeta
        return picsMeta
    }

    static async UpdatePic(file_id: ObjectId, generated_prompt: string){
        const result: UploadResponse = {
            stream_done: false,
            meta_done: false,
            file_id: undefined,
            buffer: undefined
        }
        const response = await stableImage(generated_prompt)
        let buffer: Buffer
        let stream_file_name = generateSlug()
        if (response.status === 200) {
            buffer = Buffer.from(response.data)
        } else {
            throw new Error(`error generating buffer`)
        }
        const stream = new Readable({
            read() {
                this.push(buffer);
                this.push(null);
            }
        })
        const upload_stream = this.bucket!.openUploadStreamWithId(file_id, `${stream_file_name}.png`)
        await pipeline(
            stream,
            upload_stream
        )
        result.stream_done = true
        return result
    }

    static async CheckPicExists(fileId: ObjectId):Promise<number> {
        let count = await this.bucket!.find({ "_id": fileId }).count()
        return count
    }
    static async DeletePic(file_id: ObjectId):Promise<void>{
        await this.picsMeta?.deleteOne({ file_id: file_id })
        await this.bucket!.delete(file_id)
    }
}
