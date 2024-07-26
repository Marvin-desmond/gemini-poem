import { ObjectId, Binary } from "mongodb"

export interface Poem {
    _id: ObjectId
    poem: string 
}

export interface PoemExtendPrompt extends Poem {
    imagine_prompt: string[]
}

export interface Imagine {
    _id: ObjectId
    poem_id: ObjectId
    imagine_prompt: string 
}

export interface Poet {
    _id: ObjectId
    name: string
    art: Binary
}

export interface Like {
    _id: ObjectId
    poem_id: ObjectId
    poet_id: ObjectId
}

export interface AiArt {
    _id: ObjectId
    poet_id: ObjectId
}

export interface ApiResponse {
    status: number 
    data: any
    message: string
}