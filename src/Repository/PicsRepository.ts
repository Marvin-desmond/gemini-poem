import { ObjectId, GridFSBucket } from "mongodb"
import { Readable, Writable } from "node:stream"
import { pipeline } from 'node:stream/promises'
import assert from 'assert'

import { UploadResponse } from "../../types"
import { stableImage } from "../../generateImage"
import { generateSlug } from "random-word-slugs"

export default class PicsRepository {
    static bucket?: GridFSBucket
    static async Init(client_db: any ) {
        if (this.bucket) return
        this.bucket = new GridFSBucket(client_db)
    }

    static async CreatePic(generated_prompt: string): Promise<UploadResponse>{
        const result: UploadResponse = {
            done: false,
            file_id: undefined,
            buffer: undefined
        }
        const response = await stableImage(generated_prompt.slice(18, -2))
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
        result.done = true
        return result
    }

    static async GetPic(file_id: ObjectId):Promise<UploadResponse> {
        const result: UploadResponse = {
            done: false,
            file_id: undefined,
            buffer: undefined
        }
        let buffers: any = []
        const bufferStream = new Writable({
            write(chunk, encoding, callback) {
              buffers.push(chunk);
              callback();
            }
          })

        await pipeline(
            this.bucket!.openDownloadStream(file_id),
            bufferStream
        )
        result.done = true;
        result.buffer = Buffer.concat(buffers)
        return result
    }

    static async UpdatePic(file_id: ObjectId, generated_prompt: string){

    }
    static async DeletePic(file_id: ObjectId):Promise<void>{
        await this.bucket!.delete(file_id)
    }
}
