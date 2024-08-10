import axios, { AxiosResponse } from "axios";
import FormData from "form-data"
import { ENVS } from "./src/envs"

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
}
