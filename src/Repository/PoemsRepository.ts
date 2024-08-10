import { ObjectId, Collection } from "mongodb"
import { Poem, PoemExtendPrompt } from "../types"

import ImaginesRepository from "./ImaginesRepository"
import PicsRepository from "./PicsRepository"

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
            // {
            //     // $unwind: "$joins"
            //     $unwind: {
            //         path: "$joins",
            //         preserveNullAndEmptyArrays: true
            //     }
            // },
            {
                $addFields: { 
                    imagine_prompt: "$joins.imagine_prompt",
                    last_modified: "$joins.last_modified"
                }
            },
            {
                $project: {
                    joins: 0
                }
            }, // { $unset: "joins" }
            {
                $lookup:
                {
                  from: "picsMeta",
                  localField: "_id",
                  foreignField: "poem_id",
                  as: "meta"
                }
            },
            {
                $addFields: { 
                    file_id: "$meta.file_id",
                }
            },
            { $unset: "meta" }
        ])).toArray()) as PoemExtendPrompt[]
        return poems
    }
    static async GetPoem(_id: ObjectId):Promise<PoemExtendPrompt>{
        let poem_aggregate = (await (this.poems!.aggregate([
            { $match: {_id: _id } },
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
                $addFields: { 
                    imagine_prompt: "$joins.imagine_prompt",
                    last_modified: "$joins.last_modified"
                }
            },
            { $unset: "joins" }])).toArray()) as PoemExtendPrompt[];
        return poem_aggregate[0];
    }
    static async CreatePoem(poem: string){
        let result = await this.poems!.insertOne({ 
            // _id: new ObjectId("507f191e810c19729de860ea"), 
            poem: poem 
        })
        return result
    }
    static async UpdatePoem(_id: ObjectId, poem: string){
        const filter = { _id: _id},
        update_doc = {
          $set: {
              poem: poem
          }
        }
        const result = await this.poems!.updateOne(filter, update_doc)
        return result
    }
    static async DeletePoem(poem_id: ObjectId){
        let result = await this.poems?.deleteOne({ _id: poem_id })
        if (result?.acknowledged && result.deletedCount == 1) {
            let meta_result = await PicsRepository.GetPicMeta(poem_id)
            ImaginesRepository.DeleteImagine(poem_id)
            if (await PicsRepository.CheckPicExists(meta_result.file_id) == 1)
                PicsRepository.DeletePic(meta_result.file_id)
        }
        return result
    }
}
