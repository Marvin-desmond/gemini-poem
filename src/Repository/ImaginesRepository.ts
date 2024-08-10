import { ObjectId, Collection } from "mongodb"
import { Imagine } from "../types"

export default class ImaginesRepository {
    static imagines?: Collection;
    static async Init(client: any ) {
        if (this.imagines) return
        try {
            this.imagines = client.collection("imagines")            
        } catch (e) {
            console.error(
              `imagines repository init fail: ${e}`,
            )
          }
    }
    static async GetImagines():Promise<Imagine[]>{
        let imagines = (await this.imagines!.find().toArray()) as Imagine[]
        return imagines
    }

    static async Getimagine(poem_id: ObjectId):Promise<Imagine[]>{
        let imagines = (await this.imagines!.find({ poem_id: poem_id}).toArray()) as Imagine[]
        return imagines
    }
    static async CreateImagine(poem_id: ObjectId, generated_prompt: string){
        const filter = { poem_id : poem_id },
              update_doc = {
                $set: {
                    last_modified: new Date(),
                    imagine_prompt: generated_prompt
                }
              },
              options = { upsert: true };
        const result = await this.imagines!.updateOne(filter, update_doc, options)
        return result
    }
    static async UpdateImagine(poem_id: ObjectId, generated_prompt: string){
        const filter = { poem_id : poem_id },
              update_doc = {
                $set: {
                    last_modified: new Date(),
                    imagine_prompt: generated_prompt
                }
              },
              options = { upsert: true };
        const result = await this.imagines!.updateOne(filter, update_doc, options)
        return result
    }
    static async DeleteImagine(poem_id: ObjectId){
        let result = await this.imagines!.deleteMany({ poem_id: poem_id })
        return result
    }
}
