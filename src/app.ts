import app from "./server"
import connection from "../db"
import { ENVS } from "../envs"

import PoemsController from "./Controller/PoemsController"
import ImaginesController from "./Controller/ImaginesController"

connection().then(async client => {
  try {
    let _client = client.db(ENVS.DB_NAME)
    PoemsController.Init(_client)
    ImaginesController.Init(_client)
    app.listen(ENVS.PORT, () => {
      console.log(`app listening on PORT ${ENVS.PORT}`)
    })
  } catch (e) {
    console.error(`Unable to establish connection ${e}`)
  }
})

/*


(async()=>{
   let result = await model.generateContent(prompt)
   console.log(result.response.text());
})()
*/
