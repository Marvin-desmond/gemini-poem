import { ObjectId, Collection } from "mongodb"
import { Imagine } from "../../types"

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
        console.log(
            `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
          )
        return result
    }
    static async UpdatePoem(){
        
    }
    static async DeletePoem(){
        
    }
}
