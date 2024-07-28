import fs from "node:fs";
import axios, { AxiosResponse } from "axios";
import FormData from "form-data"
import connection from "./db"

import { Readable } from "node:stream"
import { GridFSBucket } from "mongodb"
import { ENVS } from "./envs"
import { generateSlug } from "random-word-slugs"
import assert from 'assert'

const stableTextToImagePayload = (prompt: string): any => {
  return {
    prompt: prompt,
    output_format: "png",
  };
};

const stableVersion = (version?: string):string => {
    let _version = version ?? "sd3"
    const baseUrl = "https://api.stability.ai/v2beta/stable-image/generate"
    const versions: Record<string, string> = {
        "ultra": `${baseUrl}/ultra`,
        "core": `${baseUrl}/core`,
        "sd3": `${baseUrl}/sd3`
    }
    return versions[_version]
}

/*
connection().then(async client => {
    const prompt = `A colossal, crimson bull, its horns tipped with molten gold, stands defiant against a backdrop of rolling, 
    snow-capped hills. The bull's eyes burn with an otherworldly fire, reflecting the stark, white expanse of the farmer's 
    land. Rendered in a hyperrealistic, video game animation style with cinematic lighting, emphasizing the dramatic contrasts 
    of light and shadow. The scene evokes a sense of awe and unease, as if witnessing a mythical creature from a forgotten age`
    try {
    const _client = client.db(ENVS.DB_NAME)
    var bucket = new GridFSBucket(_client)
    const response = await stableImage(prompt)
    let buffer: Buffer
    if (response.status === 200) {
        const word = generateSlug()
        fs.writeFileSync(`./public/random/${word}.png`, Buffer.from(response.data))
        buffer = Buffer.from(response.data)
      } else {
        console.log(`error generating buffer`)
        return
      }
    const stream = new Readable()
    const upload_stream = bucket.openUploadStream('meistersinger.png')
    stream.push(buffer)
    stream.push(null)
    stream.pipe(upload_stream).
    on('error', function(error) {
      assert.ifError(error);
    }).
    on('finish', function() {
        console.log('File ID:', upload_stream.id)
      console.log('done!');
      process.exit(0);
    })
    } catch (e) {
      console.error(`Unable to establish connection ${e}`)
    }
  })
*/

export const stableImage = async (prompt: string):Promise<AxiosResponse<any, any>> => {
  const payload = stableTextToImagePayload(prompt)
  const stable_version = stableVersion()
  const response = await axios.postForm(
    stable_version,
    axios.toFormData(payload, new FormData()),
    {
      validateStatus: undefined,
      responseType: "arraybuffer",
      headers: {
        Authorization: `Bearer ${ENVS.STABILITY_API_KEY}`,
        Accept: "image/*",
      },
    }
  );
  return response
//   if (response.status === 200) {
//     const word = generateSlug()
//     fs.writeFileSync(`./public/random/${word}.png`, Buffer.from(response.data))
//     return Buffer.from(response.data)
//   } else {
//     throw new Error(`${response.status}: ${response.data.toString()}`);
//   }
}
