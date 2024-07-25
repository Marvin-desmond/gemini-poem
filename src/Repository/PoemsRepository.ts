import { ObjectId, Collection } from "mongodb"
import { Poem, PoemExtendPrompt } from "../../types"

export default class PoemsRepository {
    static poems?: Collection;
    static async Init(client: any ) {
        if (this.poems) return
        try {
            this.poems = client.collection("poems")
        } catch (e) {
            console.error(
              `poems repository init fail: ${e}`,
            )
          }
    }
    static async GetPoems():Promise<PoemExtendPrompt[]>{
        let poems = (await (this.poems!.aggregate([
            {
                $lookup:
                {
                  from: "imagines",
                  localField: "_id",
                  foreignField: "poem_id",
                  as: "joins"
                }
            },
            {
                $addFields: { imagine_prompt: "$joins.imagine_prompt" }
            },
            {
                $unset: "joins"
            }
        ])).toArray()) as PoemExtendPrompt[]
        return poems
    }
    static async GetPoem(_id: ObjectId):Promise<Poem>{
        let poem = (await this.poems!.findOne({ _id: _id })) as Poem
        return poem
    }
    static async CreatePoem(poem: string){
        let result = await this.poems!.insertOne({ 
            _id: new ObjectId("507f191e810c19729de860ea"), 
            poem: poem 
        })
        return result
    }
    static async UpdatePoem(){
        
    }
    static async DeletePoem(){
        
    }
}
